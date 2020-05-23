import * as Yup from 'yup';
/**
 * Yup schema validator
 *
 * @param {Object} data
 * @param {Yup.Schema} schema
 * @param {Function} success
 * @param {Function} error
 */
export default async function (data, schema, success, error) {
  try {
    await schema.validate(data);
  } catch (e) {
    return error(e.message);
  }

  return success();
}
