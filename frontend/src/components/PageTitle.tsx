import { PropsWithChildren } from 'react';

type Props = PropsWithChildren & {
  title: string;
  subtitle: string;
};

const PageTitle = ({ title, subtitle, children }: Props) => (
  <h1 className="page-title">
    <div className="title">
      {title}
      <span className="subtitle">{subtitle}</span>
    </div>
    {children && <div className="title-children">{children}</div>}
  </h1>
);

export default PageTitle;
