import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      links={[
        // {
        //   key: '智能 BI',
        //   title: '智能 BI',
        //   href: 'https://github.com/codney56/BI',
        //   blankTarget: true,
        // },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/codney56/BI',
          blankTarget: true,
        },
        {
          key: '智能 BI',
          title: '智能 BI',
          href: 'https://github.com/codney56/BI',
          blankTarget: true,
        },
      ]}
      copyright='2024 浦江智能BI'
    />
  );
};

export default Footer;
