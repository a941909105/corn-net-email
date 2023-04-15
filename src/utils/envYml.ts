/*
 * @Author: mmmmmmmm
 * @Date: 2022-07-21 10:39:58
 * @Description: 环境变量(需要在main 第一个位置引入)
 */

import { readFileSync } from "fs";
import * as yaml from "js-yaml";
import * as path from "path";
import { get, merge } from "lodash";
/**@name 当前环境(development|production) 可修改直接的环境地址 */
// export const NODE_ENV = process.env.NODE_ENV || 'development';
export const NODE_ENV = process.env.NODE_ENV || "development";

const YAML_CONFIG_FILENAME = NODE_ENV + ".yml";
const YAML_COMMON_CONFIG_FILENAME = "common.yml";
function InitEnvVariable() {
  // 读取根目录中的YML
  const currentEnv = yaml.load(
    readFileSync(
      path.join(path.resolve("./public"), YAML_CONFIG_FILENAME),
      "utf8"
    )
  ) as Record<string, any>;
  const commonEnv = yaml.load(
    readFileSync(
      path.join(path.resolve("./public"), YAML_COMMON_CONFIG_FILENAME),
      "utf8"
    )
  ) as Record<string, any>;
  return merge(commonEnv, currentEnv);
}
/**@name 全局环境变量 */
export const ENV_VARIABLE = InitEnvVariable();
/**@name 获取环境变量数值型 */
export const GET_ENV_NUMBER_VARIABLE = (
  key: string,
  defaultValue = 0
): number => {
  return Number(get(ENV_VARIABLE, key) ?? defaultValue);
};
/**@name 获取环境变量布尔型 */
export const GET_ENV_BOOL_VARIABLE = (
  key: string,
  defaultValue = false
): boolean => {
  return Boolean(get(ENV_VARIABLE, key) ?? defaultValue);
};
/**@name 获取环境变量字符型 */
export const GET_ENV_STRING_VARIABLE = (
  key: string,
  defaultValue = ""
): string => {
  return (get(ENV_VARIABLE, key) ?? defaultValue).toString();
};
/**@name 获取环境变量对象型 */
export const GET_ENV_OBJECT_VARIABLE = (key: string, defaultValue = {}) => {
  return get(ENV_VARIABLE, key) ?? defaultValue;
};
