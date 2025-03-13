"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/table";
import { useEffect, useState } from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

// 註冊必需的 Chart.js 組件
ChartJS.register(ChartDataLabels, CategoryScale, BarElement, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);
// 圖表的選項
const barOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false
    },
    title: {
      display: false
    },
    datalabels: {
      display: false, // 開啟數據標籤顯示
      align: "center", // 顯示位置：可選 top, start, end, center 等
      anchor: "end", // 數據標籤位置
      color: "red", // 顏色
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
      anchor: "end",
      color: "black",
      font: {
        size: 14,
        weight: "bold"
      },
      formatter: (value) => {
        return value; // 顯示數據
      }
    }
  }
};

const pieOptions = {
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
      anchor: "end",
      color: "black",
      font: {
        size: 14,
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
      setReturnData(res);
      console.log(res);
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
      colors.push(`hsl(${Math.random() * 360}, 100%, 50%)`); // 隨機顏色
    }
    return colors;
  };

  return (
    <div className="px-10 py-5">
      {returnData.map((item, index) => {
        const backgroundColors = generateColors(item.content.length);

        return (
          <div key={index}>
            <div className="text-2xl text-blue-600 mt-12">{item.title}</div>
            <div className="grid grid-cols-3 gap-5 p-5 border-2">
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
                />
              </div>
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
                />
              </div>
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
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
