const time = document.querySelector('.time');
var t = null;
t = setTimeout(getTime, 1000);

//获取当前时间并设置格式
function getTime() {
    const date = new Date();
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    month = month <= 9 ? '0' + month : month;
    let day = date.getDate();
    day = day <= 9 ? '0' + day : day;
    let hour = date.getHours();
    hour = hour <= 9 ? '0' + hour : hour;
    let minute = date.getMinutes();
    minute = minute <= 9 ? '0' + minute : minute;
    let secound = date.getSeconds();
    secound = secound <= 9 ? '0' + secound : secound;
    time.innerHTML = '当前时间：' + year + '年' + month + '月' + day + '-' + hour + '时' + minute + '分' + secound + '秒';
    t = setTimeout(getTime, 1000);
}

// 发起接口访问请求
function requireTool(tsCode) {
    let promise = new Promise((resolve) => {
        let xml = new XMLHttpRequest();
        xml.open('POST', 'http://api.tushare.pro');
        xml.send(JSON.stringify({
            "api_name": "daily",
            "token": "7f22c6a9be81e94ac0e7566090ddee681b7cf325154d032a0865dfe2",
            "params": { "ts_code": `${tsCode}`, "start_date": "20220901", "end_date": "20221227" },
            "fields": ["open", "close"]
        }))
        xml.onreadystatechange = function () {
            resolve(JSON.parse(xml.responseText).data.items)
        }
    })
    return promise;
}

//得到开盘价数组
function getOpenArr(item) {
    let arr = [];
    for (const t of item) {
        arr.push(t[0]);
    }
    return arr;
}

//得到收盘价数组
function getCloseArr(item) {
    let arr = [];
    for (const t of item) {
        arr.push(t[1]);
    }
    return arr;
}

// 折线图1
(function () {
    let promise = Promise.all([requireTool("600021.SH")])
    promise.then(function (items) {
        let item = items;
        const data1 = getOpenArr(item[0]);
        const data2 = getCloseArr(item[0]);
        let myChart = echarts.init(document.querySelector('.line1 .chart'))
        option = {
            color: ['#00f2f1', '#ed3f35'],
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                textStyle: {
                    color: '#4c9bfd' // 图例文字颜色
                },
                right: '10%' // 距离右边10%
            },
            grid: {
                top: '20%',
                left: '3%',
                right: '4%',
                bottom: '3%',
                show: true,// 显示边框
                borderColor: '#012f4a',// 边框颜色
                containLabel: true // 包含刻度文字在内
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['9月', '10月', '11月', '12月', '1月'],
                axisTick: {
                    show: false // 去除刻度线
                },
                axisLabel: {
                    color: '#4c9bfd' // 文本颜色
                },
                axisLine: {
                    show: false // 去除轴线
                },
            },
            yAxis: {
                min: function (value) {//取最小值向下取整为最小刻度
                    return value.min
                },
                max: function (value) {//取最大值向上取整为最大刻度
                    return value.max
                },
                min: 9.5,  //取0为最小刻度
                max: 8.8, //取100为最大刻度
                type: 'value',
                axisTick: {
                    show: false  // 去除刻度
                },
                axisLabel: {
                    color: '#4c9bfd' // 文字颜色
                },
                splitLine: {
                    lineStyle: {
                        color: '#012f4a' // 分割线颜色
                    }
                }
            },
            series: [
                {
                    name: '开盘价',
                    data: data1,
                    type: 'line',
                    // 折线修饰为圆滑
                    smooth: true,
                },
                {
                    name: '收盘价',
                    data: data2,
                    type: 'line',
                    // 折线修饰为圆滑
                    smooth: true,
                },
            ]
        };
        myChart.setOption(option);
        window.addEventListener("resize", function () {
            myChart.resize();
        });
    })
})();

// 折线图2
(function () {
    let promise = Promise.all([requireTool("603105.SH")])
    promise.then(function (items) {
        let item = items;
        const data1 = getOpenArr(item[0]);
        const data2 = getCloseArr(item[0]);
        let myChart = echarts.init(document.querySelector('.line2 .chart'))
        option = {
            tooltip: {
                trigger: 'axis',
            },
            legend: {
                top: "0%",
                textStyle: {
                    color: "rgba(255,255,255,.5)",
                    fontSize: "12"
                }
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            grid: {
                left: "10",
                top: "30",
                right: "10",
                bottom: "10",
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: ["9月", "10月", "11月", "12月", "1月"],
                    // 文本颜色为rgba(255,255,255,.6)  文字大小为 12
                    axisLabel: {
                        textStyle: {
                            color: "rgba(255,255,255,.6)",
                            fontSize: 12
                        }
                    },
                    // x轴线的颜色为   rgba(255,255,255,.2)
                    axisLine: {
                        lineStyle: {
                            color: "rgba(255,255,255,.2)"
                        }
                    },
                }
            ],
            yAxis: [
                {
                    min: function (value) {//取最小值向下取整为最小刻度
                        return value.min
                    },
                    max: function (value) {//取最大值向上取整为最大刻度
                        return value.max
                    },
                    min: 11,  //取0为最小刻度
                    max: 14, //取100为最大刻度
                    type: 'value',
                    axisTick: { show: false },
                    axisLine: {
                        lineStyle: {
                            color: "rgba(255,255,255,.1)"
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: "rgba(255,255,255,.6)",
                            fontSize: 12
                        }
                    },
                    // 修改分割线的颜色
                    splitLine: {
                        lineStyle: {
                            color: "rgba(255,255,255,.1)"
                        }
                    }
                }
            ],
            series: [
                {
                    name: '开盘价',
                    type: 'line',
                    smooth: true,
                    // 填充区域
                    areaStyle: {
                        // 渐变色，只需要复制即可
                        color: new echarts.graphic.LinearGradient(
                            0,
                            0,
                            0,
                            1,
                            [
                                {
                                    offset: 0,
                                    color: "rgba(1, 132, 213, 0.4)"   // 渐变色的起始颜色
                                },
                                {
                                    offset: 0.8,
                                    color: "rgba(1, 132, 213, 0.1)"   // 渐变线的结束颜色
                                }
                            ],
                            false
                        ),
                        shadowColor: "rgba(0, 0, 0, 0.1)"
                    },
                    // 设置拐点 小圆点
                    symbol: "circle",
                    // 拐点大小
                    symbolSize: 8,
                    // 设置拐点颜色以及边框
                    itemStyle: {
                        color: "#0184d5",
                        borderColor: "rgba(221, 220, 107, .1)",
                        borderWidth: 12
                    },
                    // 开始不显示拐点， 鼠标经过显示
                    showSymbol: false,
                    // 单独修改线的样式
                    lineStyle: {
                        color: "#0184d5",
                        width: 2
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    data: data1,
                },
                {
                    name: "收盘价",
                    type: "line",
                    smooth: true,
                    lineStyle: {
                        normal: {
                            color: "#00d887",
                            width: 2
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(
                                0,
                                0,
                                0,
                                1,
                                [
                                    {
                                        offset: 0,
                                        color: "rgba(0, 216, 135, 0.4)"
                                    },
                                    {
                                        offset: 0.8,
                                        color: "rgba(0, 216, 135, 0.1)"
                                    }
                                ],
                                false
                            ),
                            shadowColor: "rgba(0, 0, 0, 0.1)"
                        }
                    },
                    // 设置拐点 小圆点
                    symbol: "circle",
                    // 拐点大小
                    symbolSize: 5,
                    // 设置拐点颜色以及边框
                    itemStyle: {
                        color: "#00d887",
                        borderColor: "rgba(221, 220, 107, .1)",
                        borderWidth: 12
                    },
                    // 开始不显示拐点， 鼠标经过显示
                    showSymbol: false,
                    emphasis: {
                        focus: 'series'
                    },
                    data: data2,
                },
            ]
        };
        myChart.setOption(option);
        window.addEventListener("resize", function () {
            myChart.resize();
        });
    })
})();

// 折线图3
(function () {
    let promise = Promise.all([requireTool("600900.SH")])
    promise.then(function (items) {
        let item = items;
        const data1 = getOpenArr(item[0]);
        const data2 = getCloseArr(item[0]);
        let myChart = echarts.init(document.querySelector('.line3 .chart'))
        option = {
            color: ['#00f2f1', '#ed3f35'],
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                textStyle: {
                    color: '#4c9bfd' // 图例文字颜色
                },
                right: '10%' // 距离右边10%
            },
            grid: {
                top: '20%',
                left: '3%',
                right: '4%',
                bottom: '3%',
                show: true,// 显示边框
                borderColor: '#012f4a',// 边框颜色
                containLabel: true // 包含刻度文字在内
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['9月', '10月', '11月', '12月', '1月'],
                axisTick: {
                    show: false // 去除刻度线
                },
                axisLabel: {
                    color: '#4c9bfd' // 文本颜色
                },
                axisLine: {
                    show: false // 去除轴线
                },
            },
            yAxis: {
                min: function (value) {//取最小值向下取整为最小刻度
                    return value.min
                },
                max: function (value) {//取最大值向上取整为最大刻度
                    return value.max
                },
                min: 20.2,  //取0为最小刻度
                max: 20.8, //取100为最大刻度
                type: 'value',
                axisTick: {
                    show: false  // 去除刻度
                },
                axisLabel: {
                    color: '#4c9bfd' // 文字颜色
                },
                splitLine: {
                    lineStyle: {
                        color: '#012f4a' // 分割线颜色
                    }
                }
            },
            series: [
                {
                    name: '开盘价',
                    data: data1,
                    type: 'line',
                    // 折线修饰为圆滑
                    smooth: true,
                },
                {
                    name: '收盘价',
                    data: data2,
                    type: 'line',
                    // 折线修饰为圆滑
                    smooth: true,
                },
            ]
        };
        myChart.setOption(option);
        window.addEventListener("resize", function () {
            myChart.resize();
        });
    })
})();

// 折线图4
(function () {
    let promise = Promise.all([requireTool("001289.SZ")])
    promise.then(function (items) {
        let item = items;
        const data1 = getOpenArr(item[0]);
        const data2 = getCloseArr(item[0]);
        let myChart = echarts.init(document.querySelector('.line4 .chart'))
        option = {
            tooltip: {
                trigger: 'axis',
            },
            legend: {
                top: "0%",
                textStyle: {
                    color: "rgba(255,255,255,.5)",
                    fontSize: "12"
                }
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            grid: {
                left: "10",
                top: "30",
                right: "10",
                bottom: "10",
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: ["9月", "10月", "11月", "12月", "1月"],
                    // 文本颜色为rgba(255,255,255,.6)  文字大小为 12
                    axisLabel: {
                        textStyle: {
                            color: "rgba(255,255,255,.6)",
                            fontSize: 12
                        }
                    },
                    // x轴线的颜色为   rgba(255,255,255,.2)
                    axisLine: {
                        lineStyle: {
                            color: "rgba(255,255,255,.2)"
                        }
                    },
                }
            ],
            yAxis: [
                {
                    min: function (value) {//取最小值向下取整为最小刻度
                        return value.min
                    },
                    max: function (value) {//取最大值向上取整为最大刻度
                        return value.max
                    },
                    min: 17,  //取0为最小刻度
                    max: 18, //取100为最大刻度
                    type: 'value',
                    axisTick: { show: false },
                    axisLine: {
                        lineStyle: {
                            color: "rgba(255,255,255,.1)"
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: "rgba(255,255,255,.6)",
                            fontSize: 12
                        }
                    },
                    // 修改分割线的颜色
                    splitLine: {
                        lineStyle: {
                            color: "rgba(255,255,255,.1)"
                        }
                    }
                }
            ],
            series: [
                {
                    name: '开盘价',
                    type: 'line',
                    smooth: true,
                    // 填充区域
                    areaStyle: {
                        // 渐变色，只需要复制即可
                        color: new echarts.graphic.LinearGradient(
                            0,
                            0,
                            0,
                            1,
                            [
                                {
                                    offset: 0,
                                    color: "rgba(1, 132, 213, 0.4)"   // 渐变色的起始颜色
                                },
                                {
                                    offset: 0.8,
                                    color: "rgba(1, 132, 213, 0.1)"   // 渐变线的结束颜色
                                }
                            ],
                            false
                        ),
                        shadowColor: "rgba(0, 0, 0, 0.1)"
                    },
                    // 设置拐点 小圆点
                    symbol: "circle",
                    // 拐点大小
                    symbolSize: 8,
                    // 设置拐点颜色以及边框
                    itemStyle: {
                        color: "#0184d5",
                        borderColor: "rgba(221, 220, 107, .1)",
                        borderWidth: 12
                    },
                    // 开始不显示拐点， 鼠标经过显示
                    showSymbol: false,
                    // 单独修改线的样式
                    lineStyle: {
                        color: "#0184d5",
                        width: 2
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    data: data1,
                },
                {
                    name: "收盘价",
                    type: "line",
                    smooth: true,
                    lineStyle: {
                        normal: {
                            color: "#00d887",
                            width: 2
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(
                                0,
                                0,
                                0,
                                1,
                                [
                                    {
                                        offset: 0,
                                        color: "rgba(0, 216, 135, 0.4)"
                                    },
                                    {
                                        offset: 0.8,
                                        color: "rgba(0, 216, 135, 0.1)"
                                    }
                                ],
                                false
                            ),
                            shadowColor: "rgba(0, 0, 0, 0.1)"
                        }
                    },
                    // 设置拐点 小圆点
                    symbol: "circle",
                    // 拐点大小
                    symbolSize: 5,
                    // 设置拐点颜色以及边框
                    itemStyle: {
                        color: "#00d887",
                        borderColor: "rgba(221, 220, 107, .1)",
                        borderWidth: 12
                    },
                    // 开始不显示拐点， 鼠标经过显示
                    showSymbol: false,
                    emphasis: {
                        focus: 'series'
                    },
                    data: data2,
                },
            ]
        };
        myChart.setOption(option);
        window.addEventListener("resize", function () {
            myChart.resize();
        });
    })
})();

// 中间折线图
(function () {
    let promise = Promise.all([requireTool("600021.SH"), requireTool("603105.SH"), requireTool("600900.SH"), requireTool("001289.SZ")])
    promise.then(function (items) {
        let item = items;
        const data1 = getOpenArr(item[0]);
        const data2 = getOpenArr(item[1]);
        const data3 = getOpenArr(item[2]);
        const data4 = getOpenArr(item[3]);
        let myChart = echarts.init(document.querySelector('.middle .chart'));
        option = {
            color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }
            },
            legend: {
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: ['9月', '10月', '11月', '12月', '1月'],
                    // 文本颜色为rgba(255,255,255,.6)  文字大小为 12
                    axisLabel: {
                        textStyle: {
                            color: "rgba(255,255,255,.6)",
                            fontSize: 12
                        }
                    },
                    // x轴线的颜色为   rgba(255,255,255,.2)
                    axisLine: {
                        lineStyle: {
                            color: "rgba(255,255,255,.2)"
                        }
                    },
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLine: {
                        lineStyle: {
                            color: "rgba(255,255,255,.1)"
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: "rgba(255,255,255,.6)",
                            fontSize: 12
                        }
                    },
                    // 修改分割线的颜色
                    splitLine: {
                        lineStyle: {
                            color: "rgba(255,255,255,.1)"
                        }
                    }
                }
            ],
            series: [
                {
                    name: '上海电力',
                    type: 'line',
                    stack: 'Total',
                    smooth: true,
                    data: ['9月', '10月', '11月', '12月', '1月'],
                    lineStyle: {
                        width: 0
                    },
                    showSymbol: false,
                    areaStyle: {
                        opacity: 0.8,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: 'rgb(128, 255, 165)'
                            },
                            {
                                offset: 1,
                                color: 'rgb(1, 191, 236)'
                            }
                        ])
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    data: data1
                },
                {
                    name: '芯能科技',
                    type: 'line',
                    stack: 'Total',
                    smooth: true,
                    lineStyle: {
                        width: 0
                    },
                    showSymbol: false,
                    areaStyle: {
                        opacity: 0.8,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: 'rgb(0, 221, 255)'
                            },
                            {
                                offset: 1,
                                color: 'rgb(77, 119, 255)'
                            }
                        ])
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    data: data2
                },
                {
                    name: '长江电力',
                    type: 'line',
                    stack: 'Total',
                    smooth: true,
                    lineStyle: {
                        width: 0
                    },
                    showSymbol: false,
                    areaStyle: {
                        opacity: 0.8,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: 'rgb(55, 162, 255)'
                            },
                            {
                                offset: 1,
                                color: 'rgb(116, 21, 219)'
                            }
                        ])
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    data: data3
                },
                {
                    name: '龙源电力',
                    type: 'line',
                    stack: 'Total',
                    smooth: true,
                    lineStyle: {
                        width: 0
                    },
                    showSymbol: false,
                    areaStyle: {
                        opacity: 0.8,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: 'rgb(255, 0, 135)'
                            },
                            {
                                offset: 1,
                                color: 'rgb(135, 0, 157)'
                            }
                        ])
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    data: data4
                },
            ]
        };
        myChart.setOption(option);
        window.addEventListener("resize", function () {
            myChart.resize();
        });
    })
})();





