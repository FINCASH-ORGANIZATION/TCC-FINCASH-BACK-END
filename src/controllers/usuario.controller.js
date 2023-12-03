const soma = (req, res) => {
    const soma = 1 + 3;
    res.json({ soma: soma })
}

module.exports = { soma }