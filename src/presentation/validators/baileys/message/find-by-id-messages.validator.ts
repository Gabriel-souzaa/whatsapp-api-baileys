import * as yup from 'yup';

export const findByIdMessagesValidator = yup.object().shape({
  id: yup.string().required(),
  to: yup.string().required(),
  messageId: yup.string().required(),
});
