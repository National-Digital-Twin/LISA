// Global imports
import { MouseEvent, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

// Local imports
import { type LogEntry } from 'common/LogEntry';
import { type Mentionable, type MentionableType } from 'common/Mentionable';
import { AddEntry, EntryList, Filter, PageTitle, Search } from '../components';
import {
  useAuth,
  useCreateLogEntry,
  useIncidents,
  useLogEntries,
  useLogEntriesUpdates
} from '../hooks';
import { Format, Icons, Search as SearchUtil } from '../utils';
import { type OnCreateEntry } from '../utils/handlers';
import { type FieldValueType, type FilterType, type SpanType } from '../utils/types';

const Logbook = () => {
  const { incidentId } = useParams();
  const { incidents } = useIncidents();
  const { logEntries } = useLogEntries(incidentId);
  const { createLogEntry, isLoading } = useCreateLogEntry(incidentId);
  const { user } = useAuth();
  const [adding, setAdding] = useState<boolean>();
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [appliedFilters, setAppliedFilters] = useState<FilterType>({ author: [], category: [] });
  const [searchText, setSearchText] = useState<string>('');

  useEffect(() => {
    const preventRefresh = (ev: BeforeUnloadEvent) => {
      const lastEntry = logEntries?.at(-1);
      const hasOffline = lastEntry?.offline === true;

      if (hasOffline || adding) {
        ev.preventDefault();
      }
    };

    window.addEventListener('beforeunload', preventRefresh);

    return () => {
      window.removeEventListener('beforeunload', preventRefresh);
    };
  }, [adding, logEntries]);

  useLogEntriesUpdates(incidentId ?? '');
  const navigate = useNavigate();

  const incident = incidents?.find((inc) => inc.id === incidentId);
  const subtitle = useMemo(() => Format.incident.name(incident), [incident]);
  const filterAuthors = useMemo(
    () => Format.incident.authors(user.current, logEntries),
    [logEntries, user]
  );
  const filterCategories = useMemo(() => Format.incident.categories(logEntries), [logEntries]);
  if (!incident) {
    return null;
  }

  const onSort = (evt: MouseEvent<HTMLAnchorElement>) => {
    evt.preventDefault();
    setSortAsc((prev) => !prev);
  };

  const onCancel = () => {
    document.documentElement.scrollTo(0, 0);
    setAdding(false);
  };

  const onAddEntryClick = () => {
    navigate('#');
    setAdding(true);
  };

  const onAddEntry: OnCreateEntry = (_entry, files) => {
    createLogEntry({ newLogEntry: _entry, selectedFiles: files });
    setTimeout(() => {
      setAdding(false);
      document.documentElement.scrollTo(0, 0);
    }, 500);
    return undefined;
  };

  const onMentionClick = (mention: Mentionable) => {
    if (mention.type === 'User') {
      // eslint-disable-next-line no-console
      console.log(`Clicked on user ${mention.id}:`, mention.label);
      navigate('#');
    } else if (mention.type === 'File') {
      navigate('#');
      const [entryId, fileName] = mention.id.split('::');
      const parentEntry = logEntries?.find((ent) => ent.id === entryId);
      const attachment = parentEntry?.attachments?.find((att) => att.name === fileName);
      if (attachment) {
        window.open(
          `api/files/${attachment.key}/${attachment.name}?mimeType=${attachment.mimeType}`,
          attachment.key
        );
      }
    } else {
      navigate(`#${mention.id}`);
    }
  };

  const onContentClick = (evt: MouseEvent<HTMLElement>) => {
    const target: SpanType = evt.target as unknown as SpanType;
    if (target?.getAttribute('data-lexical-mention')) {
      onMentionClick({
        id: target.getAttribute('data-lexical-mention') as string,
        type: target.getAttribute('data-lexical-mention-type') as MentionableType,
        label: target.textContent ?? ''
      });
    } else if (target.tagName !== 'A') {
      navigate('#');
    }
  };

  const onFilterChange = (id: keyof FilterType, value: FieldValueType) => {
    setAppliedFilters((prev) => ({ ...prev, [id]: value }));
  };

  const onSearch = (value: string) => {
    setSearchText(value.trim());
  };

  const filterEntries = (e: LogEntry): boolean => SearchUtil.entries(e, appliedFilters, searchText);

  return (
    <div className="wrapper">
      <div className="container">
        <PageTitle title="Incident log" subtitle={subtitle}>
          {!adding && (
            <button type="button" className="button blue" onClick={onAddEntryClick}>
              + Add log entry
            </button>
          )}
        </PageTitle>

        {adding && (
          <AddEntry
            incident={incident}
            entries={logEntries ?? []}
            onCreateEntry={onAddEntry}
            onCancel={onCancel}
            loading={isLoading}
          />
        )}

        <div className="log-entries-wrapper">
          {logEntries !== undefined && logEntries.length > 0 ? (
            <>
              <form className="search-container">
                <div className="search-heading">
                  Most recent at the&nbsp;
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <Link className="highlight-blue" onClick={onSort} to="">
                    {sortAsc ? 'bottom' : 'top'}
                    <Icons.Sort
                      style={{
                        position: 'relative',
                        width: '9px',
                        marginLeft: '10px',
                        height: 'auto'
                      }}
                    />
                  </Link>
                </div>
                <hr />
                <Search searchText={searchText} onChange={onSearch} />
                <hr />
                <Filter
                  applied={appliedFilters}
                  totalCount={logEntries?.length}
                  categories={filterCategories}
                  authors={filterAuthors}
                  onChange={onFilterChange}
                />
              </form>
              <EntryList
                entries={(logEntries ?? []).filter(filterEntries)}
                sortAsc={sortAsc}
                onContentClick={onContentClick}
                onMentionClick={onMentionClick}
              />
            </>
          ) : (
            <>
              <h3>There are currently no log entries.</h3>
              <hr />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Logbook;
