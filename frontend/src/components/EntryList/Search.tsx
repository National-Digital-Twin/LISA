// Global imports
import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

// Local imports
import { Icons } from '../../utils';

type Props = {
  searchText: string;
  onChange: (value: string) => void;
};

const Search = ({ searchText, onChange }: Props) => {
  const input = useRef(null);
  const [value, setValue] = useState<string>(searchText);

  const onSearch = () => onChange(value);

  const onInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setValue(evt.target.value);
  };

  const onClickSearch = (evt: MouseEvent<HTMLAnchorElement>) => {
    evt.preventDefault();
    onSearch();
  };

  useEffect(() => {
    if (input.current) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (input.current as any).addEventListener('search', (evt: any) => {
        onChange(evt.target.value);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="section log-form log-search">
      <h4>Search</h4>
      <input
        ref={input}
        id="searchentries"
        type="search"
        value={value}
        onChange={onInputChange}
        placeholder="Search..."
      />
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <Link className="search-icon" onClick={onClickSearch} to="">
        <Icons.Search onClick={() => onSearch()} />
      </Link>
    </div>
  );
};

export default Search;

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
