export const ErrorsStatus = {
  OK: 200,
  Created: 201,
  Accepted: 202,
  No_Content: 204,
  Bad_Request: 400,
  Unauthorized: 401,
  Forbidden: 403,
  Not_Found: 404,
  Method_Not_Allowed: 405,
  Not_Acceptable: 406,
  Request_Timeout: 408,
  Conflict: 409,
  Gone: 410,
  Length_Required: 411,
  Payload_Too_Large: 413,
  Unsupported_Media_Type: 415,
  Unprocessable_Entity: 422,
  Internal_Server_Error: 500,
  Not_Implemented: 501,
  Bad_Gateway: 502,
  Service_Unavailable: 503,
};

Object.freeze(ErrorsStatus);
