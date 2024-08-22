export const isLink = (exp: string, got: string): boolean => {
  return exp === got;
};

export const isLower = (v1: number,v2: number): boolean => {
  return v1 < v2;
};

export const ifEqual = (a: number, b: number,extra: number): boolean => {
  return a === (b+extra);
};

export const ifDifferent = (a: number, b: number): boolean => {
  return a !== b;
};

export const displayPagesNumber = (interval: number,current: number, pages: number ): Array<number> => {
  let result = [];
  for (; interval <= (current+ 4) && interval <= pages; interval++){
    result.push(interval);
  }
  return result;
};

export const constructUrl = (url: string, param: string): string => {
  let data = url.includes("&") ? url.split("&") : url.split("?");
  for(let i = 0; i< data.length;i++){
    if(data[i].includes("page")){
      data[i] = "page="+param;
    }
  }
  return url.includes("&") ? data.join("&") : data.join("?");
};

export const contains = (a: string, b:string): boolean => {
  return a.includes(b);
};

export const or = (v1: boolean, v2: boolean): boolean => {
  return v1 || v2;
};

export const repoName = (v1: string): string => {
  const part: Array<string> = v1.split('/');
  return `${part[3]}/${part[4]}`;
};

export const addClassIfEqual = (v1: number, v2: number, extra: number, v3: string): string => {
  return v1 === (v2+extra) ? v3 : '';
};