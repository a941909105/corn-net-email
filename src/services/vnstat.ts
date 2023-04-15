/*
 * @Author: mmmmmmmm
 * @Date: 2023-04-15 20:44:34
 * @Description: 获取流量
 */
const { exec } = require("child_process");
// 格式化网络接口的流量数据
export function formatInterfaceToRTX(
  interfacesData: NetworkInterface[]
): NetworkTansformFlow {
  // 合并全部网络接口的流量数据
  const totalTraffic = {
    rx: 0,
    tx: 0,
  };

  for (const interfaceData of interfacesData) {
    const interfaceTraffic = interfaceData.traffic.total; // 获取当前网络接口的总流量数据
    totalTraffic.rx += interfaceTraffic.rx; // 累加接收流量
    totalTraffic.tx += interfaceTraffic.tx; // 累加发送流量
  }
  // 单位是byte
  return Object.assign(totalTraffic, {
    rxMB: Number((totalTraffic.rx / 1024 / 1024).toFixed(2)),
    txMB: Number((totalTraffic.tx / 1024 / 1024).toFixed(2)),
    rxGB: Number((totalTraffic.rx / 1024 / 1024 / 1024).toFixed(2)),
    txGB: Number((totalTraffic.tx / 1024 / 1024 / 1024).toFixed(2)),
  });
}

//时分
export type NetworkTime = {
  hour: number;
  minute: number;
};
// 输入输出流
export type NetworkInOutFlow = {
  rx: number;
  tx: number;
};
export type NetworkTansformFlow = NetworkInOutFlow & {
  rxMB: number;
  txMB: number;
  rxGB: number;
  txGB: number;
};
//年月日
export type NetworkDate = {
  year: number;
  month: number;
  day: number;
};
// 流集合
export type NetworkTrafficItem = {
  id: number;
  date: NetworkDate;
  timestamp: number;
  time: NetworkTime;
} & NetworkInOutFlow;
export type NetworkInterface = {
  name: string;
  alias: string;
  created: {
    date: NetworkDate;
    timestamp: number;
  };
  updated: {
    date: NetworkDate;
    time: NetworkTime;
    timestamp: number;
  };
  traffic: {
    total: NetworkInOutFlow;
    fiveminute?: NetworkTrafficItem[];
    hour?: NetworkTrafficItem[];
    day?: NetworkTrafficItem[];
    month?: NetworkTrafficItem[];
    year?: NetworkTrafficItem[];
    top?: NetworkTrafficItem[];
  };
};
// 获取所有网络接口的数据
export function getVnStatData(
  jsonCommand = "h 24"
): Promise<NetworkInterface[]> {
  return new Promise((resolve, reject) => {
    exec("vnstat --json " + jsonCommand, (error, stdout, stderr) => {
      if (error) {
        return reject(new Error(`执行 vnStat 命令时出错: ${error.message}`));
      }
      if (stderr) {
        return reject(new Error(`vnStat 错误输出: ${stderr}`));
      }

      const vnstatData = JSON.parse(stdout);
      const interfacesData = vnstatData.interfaces; // 获取所有网络接口的数据
      resolve(interfacesData);
    });
  });
}

export function testData(): NetworkInterface[] {
  return [
    {
      name: "eth0",
      alias: "",
      created: {
        date: { year: 2023, month: 1, day: 14 },
        timestamp: 1673635246,
      },
      updated: {
        date: { year: 2023, month: 4, day: 15 },
        time: { hour: 21, minute: 40 },
        timestamp: 1681566000,
      },
      traffic: {
        total: { rx: 516457187, tx: 531263422 },
        hour: [
          {
            id: 1,
            date: { year: 2023, month: 4, day: 15 },
            time: { hour: 15, minute: 0 },
            timestamp: 1681542000,
            rx: 14908441,
            tx: 15273858,
          },
          {
            id: 2,
            date: { year: 2023, month: 4, day: 15 },
            time: { hour: 16, minute: 0 },
            timestamp: 1681545600,
            rx: 42900426,
            tx: 44927837,
          },
          {
            id: 3,
            date: { year: 2023, month: 4, day: 15 },
            time: { hour: 17, minute: 0 },
            timestamp: 1681549200,
            rx: 69312781,
            tx: 64911556,
          },
          {
            id: 4,
            date: { year: 2023, month: 4, day: 15 },
            time: { hour: 18, minute: 0 },
            timestamp: 1681552800,
            rx: 116311280,
            tx: 118021785,
          },
          {
            id: 5,
            date: { year: 2023, month: 4, day: 15 },
            time: { hour: 19, minute: 0 },
            timestamp: 1681556400,
            rx: 152785363,
            tx: 154603817,
          },
          {
            id: 6,
            date: { year: 2023, month: 4, day: 15 },
            time: { hour: 20, minute: 0 },
            timestamp: 1681560000,
            rx: 65783160,
            tx: 69530208,
          },
          {
            id: 7,
            date: { year: 2023, month: 4, day: 15 },
            time: { hour: 21, minute: 0 },
            timestamp: 1681563600,
            rx: 10652088,
            tx: 18297337,
          },
        ],
      },
    },
  ];
}
