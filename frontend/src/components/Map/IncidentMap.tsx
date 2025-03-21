// Global imports
import 'maplibre-gl/dist/maplibre-gl.css';
import { FitBoundsOptions } from 'maplibre-gl';
import { MouseEvent, useEffect, useMemo, useRef, useState } from 'react';
import Map, { Marker, MapRef, NavigationControl, LngLatBoundsLike } from 'react-map-gl/maplibre';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';

// Local imports
import { type Coordinates } from 'common/Location';
import { type LogEntry } from 'common/LogEntry';
// eslint-disable-next-line import/no-extraneous-dependencies
import { LogEntryTypes } from 'common/LogEntryTypes';
import { type MentionableType } from 'common/Mentionable';
import { Box, IconButton } from '@mui/material';
import { bem, Icons, MapUtils } from '../../utils';
import { type FullLocationType, type SpanType } from '../../utils/types';
import EntryItem from '../EntryList/EntryItem';
import { INITIAL_VIEW_STATE, MAP_BOUNDS, MAP_STYLE } from './config';
import { useResponsive } from '../../hooks/useResponsiveHook';

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
  const [redrawing, setRedrawing] = useState<boolean>(false);
  const mapRef = useRef<MapRef>(null);
  const navigate = useNavigate();
  const highlighted = logEntries?.find((entry) => entry.id === highlightId);
  const showLogList = Boolean(logEntries?.length && highlighted);

  const logListRef = useRef<HTMLDivElement>(null);

  const FOOTER_HEIGHT = 50;

  const [mapHeight, setMapHeight] = useState<number>(window.innerHeight - FOOTER_HEIGHT);

  useEffect(() => {
    const updateMapHeight = () => {
      let newHeight = window.innerHeight - FOOTER_HEIGHT;
      if (showLogList && logListRef.current) {
        // Subtract the log list height from the window height (or any container height)
        newHeight -= logListRef.current.clientHeight;
      }
      setMapHeight(newHeight);
    };

    updateMapHeight();
    window.addEventListener('resize', updateMapHeight);

    return () => {
      window.removeEventListener('resize', updateMapHeight);
    };
  }, [showLogList]);

  const markers: LogEntryMarkerType[] = useMemo(() => {
    if (!logEntries) return [];
    return logEntries
      .map((entry) => {
        const { coordinates } = (entry.location || {}) as FullLocationType;
        if (coordinates) {
          return {
            id: entry.id,
            coordinates,
            highlighted: entry.id === highlightId,
            colour: LogEntryTypes[entry.type]?.colour
          };
        }
        return null;
      })
      .filter((m) => !!m) as LogEntryMarkerType[];
  }, [logEntries, highlightId]);

  const mapBounds: LngLatBoundsLike | undefined = useMemo(
    () => MapUtils.getBounds(markers.map((m) => m.coordinates)),
    [markers]
  );

  const zoomMap = (bounds: LngLatBoundsLike | undefined, focus?: LogEntry) => {
    if (mapRef.current) {
      const options: FitBoundsOptions = { padding: 60, duration: 250 };
      const { coordinates } = (focus?.location || {}) as FullLocationType;
      if (coordinates) {
        options.center = [coordinates.longitude, coordinates.latitude];
      }
      if (bounds) {
        mapRef.current.fitBounds(bounds, options);
      } else {
        mapRef.current.getMap().flyTo(options);
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
    if (highlightId === id) {
      navigate('#');
    } else {
      navigate(`#${id}`);
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
      sx={{ position: 'relative', height: mapHeight }}
    >
      <Map
        ref={mapRef}
        initialViewState={INITIAL_VIEW_STATE}
        mapStyle={MAP_STYLE}
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
            bottom: 2,
            left: 5,
            width: 'calc(100% - 53px)',
            maxWidth: 1600,
            p: 1
          }}
          className="log-entry-list"
        >
          <EntryItem
            entries={logEntries}
            entry={highlighted}
            disableScrollTo
            onContentClick={onEntryContentClick}
            onMentionClick={() => {}}
            metaItems={[
              <IconButton onClick={onVisitLog} title="See in incident log">
                <ImportContactsIcon fontSize="small" />
              </IconButton>,
              <IconButton onClick={onCloseInfo} title="Close information">
                <CloseIcon fontSize="small" />
              </IconButton>
            ]}
          />
        </Box>
      )}
    </Box>
  );
}
