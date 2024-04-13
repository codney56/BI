import { genChartByAiUsingPost, listChartByPageUsingPost } from '@/services/mybi/chartController';
import { UploadOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Button, Form, Select, Space, Upload, message } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';

/**
 * 添加图表页面
 * @constructor
 * 
 */
const AddChart: React.FC = () => {
 
  //定义状态，用来接收后端的返回值，让它实时展示在页面上
  const [chart, setChart] = useState<API.BiResponse>();
  const [option, setOption] = useState<any>();
  //提交中的状态，默认未提交
  const [submitting, setSubmitting] = useState<boolean>(false);

  /**
   * 提交
   * @param values 
   */
  const onFinish = async (values: any) => {
    //如果已经是提交中的状态（还在加载），直接返回，避免重复提交
    if (submitting) {
      return;
    }
    //当开始提交，把submitting设置为true
    setSubmitting(true);
    
    const params = {
      ...values,
      file: undefined,
    };
    try {
      const res = await genChartByAiUsingPost(params, {}, values.file.file.originFileObj);
      if (!res?.data) {
        message.error('分析失败');
      }else{
        
        message.success('分析成功');
        //解析成对象，为空  则设为空字符串
        const chartOption = JSON.parse(res.data.genChart ?? '');
        //如果为空，则抛出异常，并提示'图表代码解析错误'
        if (!chartOption){
          throw new Error('图表代码解析错误')
          //如果成功
        }else{
          //从后端得到响应结果之后，把响应结果设置到图表状态里
          setChart(res.data);
          setOption(chartOption);
        }
      }
      //异常情况下，提示分析失败+具体失败原因
    } catch (e: any) {
      message.error('分析失败:' + e.message );
    }
    //当结束提交，把submitting设置为false
    setSubmitting(false);
  };

  return (
    //把页面内容指定一个类名add-chart
    <div className="add-chart">
      <Form name="addChart" onFinish={onFinish} initialValues={{}}>
        <Form.Item
          name="goal"
          label="分析目标"
          rules={[{ required: true, message: '请输入分析目标' }]}
        >
          <TextArea placeholder="请输入你的分析需求，比如：分析网站的增长情况" />
        </Form.Item>

        <Form.Item name="name" label="图表名称">
          <TextArea placeholder="请输入你的图表名称" />
        </Form.Item>

        <Form.Item name="chartType" label="图表类型">
          <Select
            options={[
              { value: '折线图', label: '折线图' },
              { value: '柱状图', label: '柱状图' },
              { value: '堆叠图', label: '堆叠图' },
              { value: '饼图', label: '饼图' },
              { value: '雷达图', label: '雷达图' },
            ]}
          ></Select>
        </Form.Item>

        <Form.Item name="file" label="原始数据">
          <Upload name="file">
            <Button icon={<UploadOutlined />}>上传CSV文件</Button>
          </Upload>
        </Form.Item>

        <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
          <Space>
            <Button type="primary" htmlType="submit" loading={submitting} disabled={submitting}>
              智能分析
            </Button>
            <Button htmlType="reset">重置</Button>
          </Space>
        </Form.Item>
      </Form>
      <div>
        分析结论：{chart?.genResult}
      </div>
      <div>
        生成图表：
        {/* 如果它存在，才渲染这个组件*/}
        {option && <ReactECharts option={option} />}
      </div>
    </div>
  );
};
export default AddChart;
