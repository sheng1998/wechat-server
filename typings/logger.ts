interface RequestLogger {
  ip?: string;
  date?: string;
  method?: string;
  url?: string;
  protocol?: string;
  status?: string;
  form?: string;
}

export { RequestLogger };
