interface Message {
  id: string;
  uid?: string;
  gid?: string;
  type: string;
  message: string;
}

export default Message;