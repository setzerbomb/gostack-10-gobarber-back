export default async function (data, schema, success, error) {
  try {
    await schema.validate(data);
  } catch (e) {
    return error(e.message);
  }

  return success();
}
