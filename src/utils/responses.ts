import { HttpException, HttpStatus } from '@nestjs/common';

export const responseSuccess = <T>(
  code: HttpStatus,
  message = 'Success',
  data?: T,
) => {
  const result = {
    meta: {
      code: code,
      success: true,
      message: message,
    },
  };

  if (data) {
    result['data'] = data;
  }

  return result;
};

export const responseError = <T>(error: T) => {
  let code = HttpStatus.INTERNAL_SERVER_ERROR;
  let message = 'Internal server error';

  if (error instanceof HttpException) {
    code = error.getStatus();
    message = error.message;
  }

  return {
    meta: {
      code: code,
      success: false,
      message: message,
    },
  };
};
