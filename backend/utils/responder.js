module.exports = {
  jsonError: (res, message, code = 400) => {
    res.status(code).json({
      status: false,
      message,
    });
  },
};
