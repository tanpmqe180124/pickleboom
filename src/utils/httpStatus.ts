const isUnauthorizedError = (status: any) => {
  return status === 401 || status === 403;
};

export default isUnauthorizedError;
