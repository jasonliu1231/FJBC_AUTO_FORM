"use client";

import { Button } from "@/components/button";
import { useEffect, useState } from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

// 註冊必需的 Chart.js 組件
ChartJS.register(ChartDataLabels, CategoryScale, BarElement, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);
// 圖表的選項
const barOptions = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      display: false
    },
    title: {
      display: false
    },
    datalabels: {
      display: true, // 開啟數據標籤顯示
      align: "center", // 顯示位置：可選 top, start, end, center 等
      anchor: "end", // 數據標籤位置
      color: "black", // 顏色
      font: {
        size: 20, // 字體大小
        weight: "bold" // 字體粗細
      },
      formatter: (value) => {
        return value; // 顯示數據
      }
    }
  }
};

const lineOptions = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      display: false
    },
    title: {
      display: false
    },
    datalabels: {
      display: false,
      align: "top",
      anchor: "start",
      color: "black",
      font: {
        size: 20,
        weight: "bold"
      },
      formatter: (value) => {
        return value; // 顯示數據
      }
    }
  }
};

const pieOptions = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      display: false
    },
    title: {
      display: false
    },
    datalabels: {
      display: false,
      align: "top",
      anchor: "center",
      color: "black",
      font: {
        size: 20,
        weight: "bold"
      },
      formatter: (value) => {
        return value; // 顯示數據
      }
    }
  }
};

export default function Home({ form_id }) {
  const [returnData, setReturnData] = useState([]);

  async function getFromList() {
    const config = {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    };

    const response = await fetch(`/api/return/pic?id=${form_id}`, config);
    const res = await response.json();
    if (response.ok) {
      setReturnData(
        res.map((item) => {
          return {
            ...item,
            show: 1
          };
        })
      );
    } else {
      alert("ERROR");
    }
  }

  useEffect(() => {
    if (form_id) {
      getFromList();
    }
  }, [form_id]);

  // 隨機生成顏色函數
  const generateColors = (num) => {
    const colors = [];
    for (let i = 0; i < num; i++) {
      colors.push(`hsl(${Math.random() * 100}, 100%, 50%)`); // 隨機顏色
    }
    return colors;
  };

  return (
    <div className="px-10 py-5 grid grid-cols-3 gap-4">
      {returnData.map((item, index) => {
        const backgroundColors = generateColors(item.content.length);
        return (
          <div key={index}>
            <div className="flex items-end m-3">
              <div className="flex-1 text-lg text-blue-600 mt-12">{item.title}</div>
              <Button
                color="sky"
                className="mx-1"
                onClick={() => {
                  setReturnData(
                    returnData.map((i, idx) => {
                      if (index == idx) {
                        return {
                          ...i,
                          show: 1
                        };
                      } else {
                        return i;
                      }
                    })
                  );
                }}
              >
                長條圖
              </Button>
              <Button
                color="sky"
                className="mx-1"
                onClick={() => {
                  setReturnData(
                    returnData.map((i, idx) => {
                      if (index == idx) {
                        return {
                          ...i,
                          show: 2
                        };
                      } else {
                        return i;
                      }
                    })
                  );
                }}
              >
                折線圖
              </Button>
              <Button
                color="sky"
                className="mx-1"
                onClick={() => {
                  setReturnData(
                    returnData.map((i, idx) => {
                      if (index == idx) {
                        return {
                          ...i,
                          show: 3
                        };
                      } else {
                        return i;
                      }
                    })
                  );
                }}
              >
                圓餅圖
              </Button>
            </div>

            <div className="p-6 border-2">
              {item.show == 1 && (
                <div className="w-full">
                  <Bar
                    data={{
                      labels: item.content,
                      datasets: [
                        {
                          data: item.count,
                          backgroundColor: backgroundColors
                        }
                      ]
                    }}
                    options={barOptions}
                    width={200}
                    height={200}
                  />
                </div>
              )}

              {item.show == 2 && (
                <div className="w-full">
                  <Line
                    data={{
                      labels: item.content,
                      datasets: [
                        {
                          data: item.count,
                          borderColor: "blue"
                          // backgroundColor: backgroundColors
                        }
                      ]
                    }}
                    options={lineOptions}
                    width={200}
                    height={200}
                  />
                </div>
              )}

              {item.show == 3 && (
                <div className="w-full">
                  <Pie
                    data={{
                      labels: item.content,
                      datasets: [
                        {
                          data: item.count,
                          backgroundColor: backgroundColors
                        }
                      ]
                    }}
                    options={pieOptions}
                    width={200}
                    height={200}
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
