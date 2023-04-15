import moment from "moment";
import { GET_ENV_OBJECT_VARIABLE } from "./utils/envYml";
import { ENV_VARIABLE } from "@/utils/index";
import { CronJob } from "cron";
import {
  NetworkTansformFlow,
  formatInterfaceToRTX,
  getVnStatData,
  testData,
} from "./services/vnstat";
import EmailControl from "./services/email";
import { judgeWall } from "./services/net";
// 每日邮件信息
function everydayEmailInfo(isToWall: boolean, data: NetworkTansformFlow) {
  const vpsInfo = GET_ENV_OBJECT_VARIABLE("vps");
  const date = moment().format("YYYY-MM-DD HH:mm");
  EmailControl.sendEmail(
    {
      subject: `VPS - ${vpsInfo.title} - ${vpsInfo.IP}`,
      html: `
        <div>
            <div>发送时间：${date}</div>
            <div>是否被墙：${isToWall ? "否" : "是"}</div>
            <div>出口流量：${data.txMB}MB(${data.txGB}GB)</div>
            <div>入口流量：${data.rxMB}MB(${data.rxGB}GB)</div>
        </div>
          `,
    },
    ["941909105@qq.com"]
  );
}
async function main() {
  const cron = GET_ENV_OBJECT_VARIABLE("cron");
  const job = new CronJob(
    cron["sendEmail"],
    async function () {
      // 24小时的流量数据
      const h24VnStat = formatInterfaceToRTX(await getVnStatData());
      const isToWall = await judgeWall();
      everydayEmailInfo(isToWall, h24VnStat);
    },
    null,
    true,
    "Asia/Shanghai"
  );
}

main();
