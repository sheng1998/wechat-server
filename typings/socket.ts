interface Message {
  id: string;
  send_user_id: string;
  receive_user_id: string;
  type: string;
  message: string;
  object: 'personal' | 'group';
}

export default Message;