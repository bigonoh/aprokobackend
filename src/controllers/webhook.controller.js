async function webhook(req, res, next) {

  const {event, data} = req.body;
  if (!data.metadata.referrer.includes('localhost')) return res.json(`error: invalid actor`)

  if (event === "charge.success") {

    // let process successfull purchase
    return res.json(req.body);
  }
}


module.exports = {
 webhook
};
