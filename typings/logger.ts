interface RequestLogger {
  ip?: string;
  date?: string;
  method?: string;
  url?: string;
  protocol?: string;
  status?: number;
  form?: string;
}

export { RequestLogger };
