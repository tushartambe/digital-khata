import {Button, Layout, Space} from 'antd';
import React from 'react';

import {footerStyle} from "../CommonStyles";
import {FacebookFilled, GithubFilled, InstagramOutlined} from '@ant-design/icons';

const {Footer} = Layout;

const CommonFooter = () => {
  return (
    <Footer style={footerStyle}>
      <Space>
        <a href={"https://github.com/tushartambe/digital-khata"} target="_blank">
          <Button type="primary" shape="circle" icon={<GithubFilled/>}/>
        </a>
        <Button type="primary" shape="circle" icon={<InstagramOutlined/>}/>
        <Button type="primary" shape="circle" icon={<FacebookFilled/>}/>
      </Space>
    </Footer>
  )
}

export default CommonFooter;