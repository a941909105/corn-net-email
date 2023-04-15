import { isEmpty } from "lodash";
import md5 from "md5";
import moment from "moment";
type Column<T> = Extract<keyof T, string>;
type ColumnChildren<T> = T & { children?: T[] };
/**
 * 将扁平数据转换为树形
 * @param options
 * @param options.sort ture 是正序 false是倒序
 */
export function listToTree<T = any>(options: {
  mainKey: Column<T>;
  parentKey: Column<T>;
  orderKey?: Column<T>;
  list: T[];
  sort?: boolean;
  format?: (value: { next: T; current: T }, index?: number, array?: T[]) => T;
}) {
  const tree = options.list.reduce(
    (prev: ColumnChildren<T>[], next: ColumnChildren<T>) => {
      let children: ColumnChildren<T>[] = options.list.filter((value) => {
        return next[options.mainKey] === value[options.parentKey];
      });
      if (typeof options.format === "function") {
        children = <ColumnChildren<any>[]>children.map(
          (value, index, array) => {
            return options.format(
              {
                next,
                current: value,
              },
              index,
              array
            );
          }
        );
      }
      if (!isEmpty(children)) {
        next.children = children;
      }
      if (
        !next[options.parentKey] ||
        options.list.findIndex(
          (p) => p[options.mainKey] === next[options.parentKey]
        ) === -1
      ) {
        prev.push(next);
      }
      if (options.orderKey) {
        let f: (a: T, b: T) => number;
        if (options.sort) {
          f = (a, b) => +b[options.orderKey] - +a[options.orderKey];
        } else {
          f = (a, b) => +a[options.orderKey] - +b[options.orderKey];
        }
        children.sort(f);
        prev.sort(f);
      }
      return prev;
    },
    []
  );
  return tree;
}
/**
 * 数据库中时间类型转换为时间字符串模板
 */
export const baseTypeOrmDateTransformer = {
  to: (v) => v,
  from: (v) => {
    if (!v) {
      return undefined;
    }
    return moment(v).format("YYYY-MM-DD HH:mm:ss");
  },
};
/**
 * 新老对比
 * @param newValues
 * @param oldValues
 * @param contrastFunc
 * @returns
 */
export function newOldContrast<T>(
  newValues: T[],
  oldValues: T[],
  contrastFunc?: (newValue: T, oldValue: T) => boolean
) {
  const newGroup: T[] = [];
  const rmGroup: T[] = [];
  const vs =
    typeof contrastFunc === "function" ? contrastFunc : (n, o) => o === n;
  oldValues.forEach((o) => {
    const findIndex = newValues.findIndex((n) => vs(o, n));
    if (findIndex === -1) {
      rmGroup.push(o);
    }
  });
  newValues.forEach((n) => {
    const findIndex = oldValues.findIndex((o) => vs(o, n));
    if (findIndex === -1) {
      newGroup.push(n);
    }
  });
  return {
    add: newGroup,
    delete: rmGroup,
  };
}
/**
 * 判断字符串是否为JSON字符串
 * @param str
 * @returns
 */
export function isJsonString(str: string) {
  try {
    if (typeof JSON.parse(str) == "object") {
      return true;
    }
  } catch (e) {}
  return false;
}
/**
 * json数组去重
 * @param objArr
 * @param uniqKey
 * @returns
 */
export function jsonUniq<T>(objArr: T[], uniqKey: keyof T) {
  const indexes: any = {};
  return objArr.filter((value) => {
    if (!indexes[value[uniqKey]]) {
      indexes[value[uniqKey]] = true;
      return true;
    } else {
      return false;
    }
  });
}
/**@name 等待时间 */
export function waitTime(n: number) {
  return new Promise<void>((r, j) => {
    setTimeout(() => {
      r();
    }, n);
  });
}
/**@name 加盐密码 */
export function buildMd5Password(password: string) {
  return md5(`saas-${password}-saas`);
}
/**@name 深度合并 */
export function deepAssign(
  oldObj: Record<string, any>,
  newObj: Record<string, any>
) {
  if (typeof oldObj !== "object" || typeof newObj !== "object") {
    throw new Error("合并的不是对象！");
  }
  for (const key in newObj) {
    if (
      oldObj[key] &&
      typeof oldObj[key] === "object" &&
      typeof newObj[key] === "object"
    ) {
      oldObj[key] = deepAssign(oldObj[key], newObj[key]);
    } else {
      oldObj[key] = newObj[key];
    }
  }
  return oldObj;
}
/**
 * 数组转对象
 */
export function arrayToObject<T extends Record<any, any>>(
  arr: T[],
  key: keyof T | ((next: T) => any),
  value: keyof T | ((next: T) => any)
): any {
  return arr.reduce<Record<any, any>>((prev, next) => {
    let partKey = key;
    if (typeof key === "function") {
      partKey = key(next);
    }
    if (typeof value === "function") {
      prev[next[partKey]] = value(next);
    } else {
      prev[next[partKey as any]] = next[value];
    }
    return prev;
  }, {});
}
/**@name 对象数组属性名称更改 */
export function arrayAttributeChange<T = Record<any, any>>(
  data: T[],
  changeAttr: [keyof T | ((value) => any), string][]
) {
  return data.map((value) => {
    const temp = { ...value };
    changeAttr.forEach((item) => {
      if (typeof item[0] === "function") {
        temp[item[1]] = item[0](temp);
      } else {
        Reflect.deleteProperty(temp as any, item[0]);
        temp[item[1]] = value[item[0]];
      }
    });
    return temp;
  });
}

/**@name 将文本分割成多个字符组 */
export function splitManyNumberString(s: string, num = 1): string[] {
  if (s.length <= 1) {
    return [s];
  }
  const splitArr = s.split("");
  const tempSArr = [];
  const floorNum = Math.floor(num);
  for (let i = 0; i < s.length; i++) {
    if (i % floorNum === 0 && i !== 0) {
      tempSArr.push(splitArr.slice(i - floorNum, i).join(""));
    }
  }
  if (s.length % floorNum !== 0) {
    tempSArr.push(
      splitArr.slice(s.length - (s.length % floorNum), s.length).join("")
    );
  } else {
    tempSArr.push(splitArr.slice(s.length - floorNum, s.length).join(""));
  }
  return tempSArr;
}
