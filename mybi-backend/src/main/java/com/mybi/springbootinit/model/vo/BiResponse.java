package com.mybi.springbootinit.model.vo;

import lombok.Data;

/**
 * BI 的返回结果
 */
@Data
public class BiResponse {
    private String genChart;
    private String genResult;
    //新生成的图表id
    private Long chartId;
}
