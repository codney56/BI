import { listMyChartByPageUsingPost } from '@/services/mybi/chartController';
import { useModel } from '@@/exports';

import { Avatar, Card, List, message,Divider } from 'antd';
import Search from 'antd/es/input/Search';
import ReactECharts from 'echarts-for-react';

import React, { useEffect, useState } from 'react';

/**
 * 我的图表页面
 * @constructor
 *
 */
const MyChartPage: React.FC = () => {
  const initSearchParams = {
    current: 1,
    pageSize: 4,
  };
  const [searchParams, setSearchParams] = useState<API.ChartQueryRequest>({ ...initSearchParams });
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState ?? {};
  const [chartList, setChartList] = useState<API.Chart[]>();
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = async () => {
    setLoading(true);

    try {
      const res = await listMyChartByPageUsingPost(searchParams);
      if (res.data) {
        setChartList(res.data.records ?? []);
        setTotal(res.data.total ?? 0);
        //隐藏图表的标题
        if (res.data.records){
          res.data.records.forEach(data => {
            const chartOption = JSON.parse(data.genChart ?? '{}');
            chartOption.title = undefined;
            data.genChart = JSON.stringify(chartOption);
          })
        }
        
      } else {
        message.error('获取我的图表失败');
      }
    } catch (e: any) {
      message.error('获取我的图表失败，' + e.message);
    }
    setLoading(false);
  };
  useEffect(() => {
    loadData();
  }, [searchParams]);
  return (
    //把页面内容指定一个类名my-chart-page
    <div className="my-chart-page">
      <div>
      <Search placeholder="请输入图表名称"  enterButton onSearch={(value) => { 
        //设置搜索条件
        setSearchParams({
          ...initSearchParams,
          name: value,
        })
      }} />
      </div>
      <div className='margin-16'/>
      <List

        grid={{       gutter: 16,
          xs: 1,
          sm: 1,
          md: 1,
          lg: 2,
          xl: 2,
          xxl: 2, }}
        pagination={{
          onChange: (page, pageSize) => {
            setSearchParams({
              ...searchParams,
              current: page,
              pageSize: pageSize
            })
            console.log(page);
          },
          current: searchParams.current,
          pageSize: searchParams.pageSize,
          total: total,
          
        }}
        loading={loading}
        dataSource={chartList}

        renderItem={(item) => (
          <List.Item key={item.id}>
            <Card>
              <List.Item.Meta
                avatar={<Avatar src={currentUser && currentUser.userAvatar} />}
                title={item.name}
                description={item.chartType ? '图表类型：' + item.chartType : undefined}
              />
              <div style={ {marginBottom: 16 }}/>
              <p>{'分析目标：' + item.goal}</p> 
              <div style={ {marginBottom: 16 }}/>
                <ReactECharts option={JSON.parse(item.genChart ?? '{}')} />
            </Card>
          </List.Item>
        )}
      />
      <br />
      {'总数：' + total}
    </div>
  );
};
export default MyChartPage;
