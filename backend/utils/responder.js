export const jsonError = (res, message, code = 400) => {
  res.status(code).json({
    status: false,
    message,
  });
};

export const jsonOK = (res, payload, message, code = 200) => {
  res.status(code).json({
    status: true,
    message,
    payload,
  });
};
