// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import { MouseEvent, ReactElement, useContext, useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Divider, Grid2 as Grid, Paper, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

// Local imports
import { type LogEntry } from 'common/LogEntry';
import { type Mentionable } from 'common/Mentionable';
import bem from '../../utils/bem';
import Attachments from './Attachments';
import Details from './Details';
import EntryLocation from './EntryLocation';
import Mentions from './Mentions';
import Meta from './Meta';
import { Format } from '../../utils';
import { useResponsive } from '../../hooks/useResponsiveHook';
import { useToast } from '../../hooks';
import { ToastContextType } from '../../utils/types';
import { ToastContext } from '../../context/ToastContext';

interface Props {
  entry: LogEntry;
  entries: Array<LogEntry>;
  disableScrollTo?: boolean;
  onContentClick: (evt: MouseEvent<HTMLElement>) => void;
  onMentionClick: (mention: Mentionable) => void;
  metaItems?: ReactElement[];
}
const EntryItem = ({
  entry,
  entries,
  disableScrollTo = false,
  onContentClick,
  onMentionClick,
  metaItems = undefined
}: Props) => {
  const LONG_PRESS_MS = 550;
  const FLASH_TOAST_MS = 1200;

  const { isMobile, isBelowMd } = useResponsive();
  const postToast = useToast();
  const { removeToast } = useContext(ToastContext) as ToastContextType;
  const { hash } = useLocation();
  const divRef = useRef<HTMLDivElement>(null);
  const { id, offline } = entry;
  const modifiers = useMemo(() => {
    const arr = [offline ? 'offline' : ''];
    if (hash === `#${id}`) {
      arr.push('highlighted');
    }
    return arr;
  }, [hash, id, offline]);
  const classes = bem('item', modifiers);

  useEffect(() => {
    if (disableScrollTo) return;
    if (divRef.current && hash === `#${id}`) {
      divRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [hash, id, disableScrollTo]);

  const timerRef = useRef<number | null>(null);

  const startPress = () => {
    if (offline) return;
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      const text = entry?.sequence != null ? entry.sequence : '';
      if (!text) return;
  
      navigator.clipboard?.writeText(text)
        .then(() => {
          const id = `copied_${text}`
          postToast({
            id,
            type: 'Success',
            content: <>Copied <strong>{text}</strong> to clipboard</>,
            isDismissable: true,
          });
          window.setTimeout(() => removeToast(id), FLASH_TOAST_MS);
        })
        .catch(() => {
          const id = `copyerror_${text}`;
          postToast({
            id,
            type: 'Error',
            content: <>Couldn’t copy <strong>{text}</strong>. Try again.</>,
            isDismissable: true,
          });
        });
    }, LONG_PRESS_MS);
  };

  const cancelPress = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };
  

  return (
    <Box component={Paper} square id={id} ref={divRef} className={classes()}>
      <div className={classes('header')}>
        <Meta entry={entry} isMobile={isMobile} isBelowMd={isBelowMd} metaItems={metaItems} />
      </div>
      {isMobile && (
        <>
          <Box display="flex" alignItems="center" gap={1}>
            <Box display="inline-flex" alignItems="center" gap={0.5} >
              <PersonIcon sx={{ fontSize: '1rem', color: 'text.primary' }}  color="action"/>
              <Typography variant="body2" sx={{ color: 'text.primary', fontSize: '0.875rem' }}>
                {Format.user(entry.author)}
              </Typography>
            </Box>
            <Grid
              component="div"
              sx={{ display: 'flex', alignItems: 'center', marginLeft:'auto', pr:1.5 }}
              size={{ xs: 2, md: 3 }}
              title={entry.offline ? 'Offline entry' : ''}
            >
              <Typography
                variant="body2"
                onTouchStart={startPress}
                onTouchEnd={cancelPress}
                onTouchMove={cancelPress}
                onTouchCancel={cancelPress}
                aria-label={entry.offline ? "Submitting" : `Copy #${entry.sequence}`}
                role="button"
                sx={{
                  color: 'text.primary',
                  textDecoration: 'none',
                  fontStyle: entry.offline ? 'italic' : 'normal',
                  cursor: entry.offline ? "default" : "copy",
                  userSelect: "none",
                }}
              >
                {entry.offline ? 'Submitting' : `#${entry.sequence}`}
              </Typography>
            </Grid>
          </Box>
          <Divider />
        </>
      )}

      <Box display="flex" flexDirection="column" gap={2} padding={2}>
        <Details entry={entry} onContentClick={onContentClick} />
        <EntryLocation entry={entry} />
        {/* <Actions entry={entry} onAction={onAction} /> */}
        <Mentions entry={entry} entries={entries} onMentionClick={onMentionClick} />
        <Attachments entry={entry} />
      </Box>
    </Box>
  );
};

export default EntryItem;
