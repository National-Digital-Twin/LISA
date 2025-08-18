// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import CloseIcon from '@mui/icons-material/Close';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import { FitBoundsOptions } from 'maplibre-gl';
import { MouseEvent, ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import Map, { LngLatBoundsLike, MapRef, Marker, NavigationControl } from 'react-map-gl/maplibre';
import { useNavigate } from 'react-router-dom';

// Local imports
import { Box, IconButton } from '@mui/material';
import { type Coordinates } from 'common/Location';
import { type LogEntry } from 'common/LogEntry';
 
import { LogEntryTypes } from 'common/LogEntryTypes';
import { type MentionableType } from 'common/Mentionable';
import { useResponsive } from '../../hooks/useResponsiveHook';
import { bem, Icons, MapUtils } from '../../utils';
import { type FullLocationType, type SpanType } from '../../utils/types';
import EntryItem from '../EntryList/EntryItem';
import { INITIAL_VIEW_STATE, MAP_BOUNDS, MAP_STYLE } from './config';

type LogEntryMarkerType = {
  id: string;
  colour: string | undefined;
  coordinates: Coordinates;
  highlighted: boolean;
};

interface Props {
  marker: LogEntryMarkerType;
  onClick: (marker: LogEntryMarkerType) => void;
}

function LogEntryMarker({ marker, onClick }: Readonly<Props>) {
  const classes = bem('map-marker', marker.highlighted ? 'highlighted' : '', marker.colour);
  return (
    <Marker
      key={marker.id}
      latitude={marker.coordinates.latitude}
      longitude={marker.coordinates.longitude}
      className={classes()}
      onClick={() => onClick(marker)}
      anchor="bottom"
    >
      <Icons.MapPin />
    </Marker>
  );
}

interface MapProps {
  logEntries: LogEntry[] | undefined;
  highlightId?: string;
}
export default function IncidentMap({ logEntries, highlightId = undefined }: Readonly<MapProps>) {
  const { isMobile } = useResponsive();
  const [redrawing, setRedrawing] = useState<boolean>(false);
  const mapRef = useRef<MapRef>(null);
  const navigate = useNavigate();
  const highlighted = logEntries?.find((entry) => entry.id === highlightId);

  const logListRef = useRef<HTMLDivElement>(null);

  const markers: LogEntryMarkerType[] = useMemo(() => {
    if (!logEntries) return [];
    const allMarkers: LogEntryMarkerType[] = [];

    logEntries.forEach((entry) => {
      const { coordinates } = (entry.location || {}) as FullLocationType;

      if (coordinates && Array.isArray(coordinates)) {
        coordinates.forEach((coordinate, index) => {
          const marker = {
            id: `${entry.id}-${index}`,
            coordinates: coordinate,
            highlighted: entry.id === highlightId,
            colour: LogEntryTypes[entry.type]?.colour
          };
          allMarkers.push(marker);
        });
      }
    });

    return allMarkers;
  }, [logEntries, highlightId]);

  const mapBounds: LngLatBoundsLike | undefined = useMemo(
    () => MapUtils.getBounds(markers.map((m) => m.coordinates)),
    [markers]
  );

  const zoomMap = (bounds: LngLatBoundsLike | undefined, focus?: LogEntry) => {
    if (mapRef.current) {
      const { coordinates } = (focus?.location || {}) as FullLocationType;

      const baseOptions: FitBoundsOptions = { padding: 60, duration: 250 };

      if (coordinates && Array.isArray(coordinates) && coordinates.length > 1) {
        const entryBounds: LngLatBoundsLike = [
          [
            Math.min(...coordinates.map((c) => c.longitude)),
            Math.min(...coordinates.map((c) => c.latitude))
          ],
          [
            Math.max(...coordinates.map((c) => c.longitude)),
            Math.max(...coordinates.map((c) => c.latitude))
          ]
        ];

        const options: FitBoundsOptions = {
          ...baseOptions,
          maxZoom: 15
        };

        mapRef.current.fitBounds(entryBounds, options);
      } else if (coordinates && Array.isArray(coordinates) && coordinates.length === 1) {
        const options: FitBoundsOptions = { ...baseOptions };
        options.center = [coordinates[0].longitude, coordinates[0].latitude];

        if (bounds) {
          mapRef.current.fitBounds(bounds, options);
        } else {
          mapRef.current.getMap().flyTo(options);
        }
      } else if (bounds) {
        mapRef.current.fitBounds(bounds, baseOptions);
      }
    }
  };

  useEffect(() => {
    setTimeout(() => {
      if (mapBounds && mapRef.current) {
        zoomMap(mapBounds, highlighted);
      }
    }, 100);
  }, [mapBounds, highlighted]);

  // This is necessary to get the markers to redraw.
  // Without this, the highlight doesn't change.
  const redraw = () => {
    setRedrawing(true);
    setTimeout(() => {
      setRedrawing(false);
    }, 0);
  };

  const onClickMarker = (marker: LogEntryMarkerType) => {
    const { id } = marker;
    const entryId = id.includes('-') ? id.substring(0, id.lastIndexOf('-')) : id;

    if (highlightId === entryId) {
      navigate('#');
    } else {
      navigate(`#${entryId}`);
    }
    if (mapRef.current) {
      zoomMap(mapBounds, highlighted);
    }
    redraw();
  };

  const onCloseInfo = () => {
    navigate('#');
    redraw();
  };

  const onVisitLog = () => {
    if (highlighted) {
      navigate(`/logbook/${highlighted.incidentId}#${highlighted.id}`);
    }
  };

  const onEntryContentClick = (evt: MouseEvent<HTMLElement>) => {
    const target: SpanType = evt.target as unknown as SpanType;
    if (target?.getAttribute('data-lexical-mention')) {
      const type = target.getAttribute('data-lexical-mention-type') as MentionableType;
      if (type === 'LogEntry') {
        const id = target.getAttribute('data-lexical-mention') as string;
        navigate(`/logbook/${highlighted?.incidentId}#${id}`);
      }
    }
  };

  return (
    <Box
      className="container--location map-container"
      sx={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <Map
        ref={mapRef}
        initialViewState={INITIAL_VIEW_STATE}
        mapStyle={MAP_STYLE as unknown as string}
        attributionControl={false}
        maxZoom={17}
        minZoom={6}
        cooperativeGestures
        maxBounds={MAP_BOUNDS}
      >
        <NavigationControl position="bottom-right" showCompass={false} />
        {!redrawing &&
          markers.map((marker) => (
            <LogEntryMarker key={marker.id} marker={marker} onClick={onClickMarker} />
          ))}
      </Map>
      {logEntries && highlighted && (
        <Box
          ref={logListRef}
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            width: '100%',
            maxWidth: '100%',
            p: isMobile ? 1 : 2,
            backgroundColor: 'white',
            borderTop: '1px solid #e0e0e0',
            boxShadow: '0 -2px 4px rgba(0,0,0,0.1)'
          }}
          className="log-entry-list"
        >
          <EntryItem
            entries={logEntries}
            entry={highlighted}
            disableScrollTo
            onContentClick={onEntryContentClick}
            onMentionClick={() => {}}
            metaItems={
              [
                !isMobile && (
                  <IconButton key="incident-log" onClick={onVisitLog} title="See in incident log">
                    <ImportContactsIcon fontSize="small" />
                  </IconButton>
                ),
                <IconButton key="close-info" onClick={onCloseInfo} title="Close information">
                  <CloseIcon fontSize="small" />
                </IconButton>
              ].filter(Boolean) as ReactElement[]
            }
          />
        </Box>
      )}
    </Box>
  );
}
