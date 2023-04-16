import moment from "moment";
import { GET_ENV_OBJECT_VARIABLE } from "./utils/envYml";
import { ENV_VARIABLE } from "@/utils/index";
import { CronJob } from "cron";
import {
  NetworkTansformFlow,
  formatInterfaceToRTX,
  getVnStatData,
  getVnStatDataInline,
  testData,
} from "./services/vnstat";
import EmailControl from "./services/email";
import { judgeWall } from "./services/net";
// 每日邮件信息
function everydayEmailInfo(
  isToWall: boolean,
  // 今日流量数据
  data: NetworkTansformFlow,
  // 当前每小时流量数据
  toDayFlow: string,
  // 今天流量数据
  dayFlow: string,
  // 发送的邮箱地址
  senderEmail: string[]
) {
  const vpsInfo = GET_ENV_OBJECT_VARIABLE("vps");
  const date = moment().format("YYYY-MM-DD HH:mm");
  return EmailControl.sendEmail(
    {
      subject: `VPS - ${vpsInfo.title} - ${vpsInfo.IP}`,
      html: `
        <div>
            <div>发送时间：${date}</div>
            <div>是否被墙：${isToWall ? "否" : "是"}</div>
            <div>出口流量：${data.txMB}MB(${data.txGB}GB)</div>
            <div>入口流量：${data.rxMB}MB(${data.rxGB}GB)</div>
            <pre>
                <h4>一天内流量使用情况</h4>
                <p>t:是出口 r:入口 tx:出口流量 rx:入口流量</p>
                ${toDayFlow}
                <br/>
                <h4>30日流量使用情况</h4>
                ${dayFlow}
            </pre>
        </div>
          `,
    },
    senderEmail
  );
}
async function main() {
  const cron = GET_ENV_OBJECT_VARIABLE("cron");
  //   console.log("====================================");
  //   console.log(JSON.stringify(formatInterfaceToRTX(testData())));
  //   console.log("====================================");
  //   everydayEmailInfo(await judgeWall(), formatInterfaceToRTX(testData()));

  const job = new CronJob(
    cron["sendEmail"],
    async function () {
      // 24小时的流量数据
      const h24VnStat = formatInterfaceToRTX(await getVnStatData());
      const toDayFlow = await getVnStatDataInline();
      const dayFlow = await getVnStatDataInline("-d 30");
      const isToWall = await judgeWall();
      console.log("====================================");
      console.log(
        "发送邮件",
        JSON.stringify(h24VnStat),
        isToWall ? "否" : "是"
      );
      everydayEmailInfo(
        isToWall,
        h24VnStat,
        toDayFlow,
        dayFlow,
        cron["sendUser"]
      )
        .then(() => {
          console.log("发送成功");
        })
        .catch((err) => {
          console.error("发送失败");
        })
        .finally(() => {
          console.log("====================================");
        });
    },
    null,
    true,
    "Asia/Shanghai"
  );
}

main();
