const input_names = [
  'amount',
  'account_number',
  'type',
  'email',
  'first_name',
  'last_name',
  'phone',
  'auth_key',
  'source',
  'session_id',
  'business_name',
  'account_bank',
  'account_name',
  'bank',
  'bvn',
];
const input_types = ['number/string', 'string'];
const { encrypt } = require('./encryption');

const headers = {
  Authorization: `Bearer ${process.env.ATLAS_API_KEY}`,
};

function inputValidator(inputs, reqBody) {
  let message = '';

  // go through the entire inputs
  if (typeof inputs === 'object') {
    let error = false;

    // check if parameter is parsed in request body
    if (inputs.length > 0) {
      inputs.map((input) => {
        if (reqBody[input]) {
          // parameter was found, check if type is correct
          const paramIndex = input_names.indexOf(input);
          const paramType = typeof reqBody[input];
          const intendedParamType = input_types[paramIndex] || 'string';

          if (!intendedParamType.includes(paramType)) {
            error = true;
            message += `${
              message.length > 0 ? ' || ' : ''
            }(${input}) needs to be of type ${intendedParamType}, detected ${paramType}`;
          } else {
            // todo: check if empty strings
          }
        } else {
          error = true;
          message += `${message.length > 0 ? ' || ' : ''}(${input}) not found in request body`;
        }
      });
    } else return 'invalid inputs';

    // return
    return error ? message : true;
  }
  return 'invalid inputs';
}

function authHeader(req) {
  // get authorization from header
  if (req.headers) {
    const auth = req.headers.authorization;

    if (auth === undefined) return 'no authorization header parsed';

    if (auth.includes('Bearer ')) {
      // check for bearer token
      const bearerToken = auth.split('Bearer ')[1];
    } else return 'api requires bearer authorization model';
  } else return 'authorization header required';
}

function success(res, message, data = null, code = 200) {
  return res.status(code).send({
    status: 'success',
    message,
    data,
  });
}

function fail(res, message, code = 200, data = null) {
  return res.status(code).send({
    status: 'fail',
    message,
    data,
  });
}
function bad(res, message, code = 400) {
  return res.status(code).send({
    status: 'fail',
    message,
  });
}

function notfound(res, message) {
  return res.status(404).send({
    status: 'fail',
    message,
  });
}

function error(res, message) {
  return res.status(500).send({
    status: 'fail',
    message,
  });
}

async function encryptedBad(res, message) {
  const encryptedResponse = await encrypt(message);
  return res.status(400).send({
    status: 'fail',
    data: encryptedResponse,
  });
}

async function encryptedFail(res, message, code = 200) {
  const encryptedResponse = await encrypt(message);
  return res.status(code).send({
    status: 'fail',
    data: encryptedResponse,
  });
}

async function encryptedSuccess(res, message, info) {
  const responseObject = {
    message,
  };
  let encryptedResponse = null;
  if (info !== '' && info !== null && info !== undefined) {
    responseObject.data = info;
    encryptedResponse = await encrypt(JSON.stringify(responseObject));
  } else {
    encryptedResponse = await encrypt(JSON.stringify(responseObject));
  }

  return res.status(200).send({
    status: 'success',
    data: encryptedResponse,
  });

  // return res.status(200).send({
  //     status: 'success',
  //     data: responseObject
  // })
}
async function encryptedNotfound(res, message, code = 404) {
  const encryptedResponse = await encrypt(message);
  return res.status(code).send({
    status: 'fail',
    data: encryptedResponse,
  });
}

module.exports = {
  inputValidator,
  success,
  fail,
  bad,
  notfound,
  error,
  authHeader,
  encryptedBad,
  encryptedFail,
  encryptedSuccess,
  encryptedNotfound,
};
