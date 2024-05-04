function endpoint(app, connpool) {

    app.post("/api/Locale", (req, res) => {
        var errors = [];
       
        var data = {
            nome: req.body.nome,
            citta: req.body.citta,
        }

        var sql = 'INSERT INTO Locale (nome, citta) VALUES (?,?)'
        var params = [data.nome, data.citta]
        connpool.query(sql, params, (error, results) => {
            if (error) {
                res.status(400).json({ "error": error.message })
                return;
            }
            res.json({
                "message": "success",
                "data": data,
                "id": this.insertID
            })
            console.log(results)
        });

    })



    app.get("/api/Locale", (req, res, next) => {
        var sql = "select * from Locale"
        var params = []
        connpool.query(sql, params, (err, rows) => {
            if (err) {
              res.status(400).json({"error":err.message});
              return;
            }
            res.json({
                "message":"success",
                "data":rows
            })
          });
    });


    app.get("/api/Locale/:id", (req, res) => {
        var sql = "select * from Locale where idLocale = ?"
        var params = [req.params.id]
        connpool.query(sql, params, (err, rows) => {
            if (err) {
              res.status(400).json({"error":err.message});
              return;
            }
            res.json({
                "message":"success",
                "data":rows[0]
            })
          });
    });


    app.put("/api/Locale/:id", (req, res) => {
        var data = {
            nome: req.body.nome,
            citta: req.body.citta,
        }
        connpool.execute(
            `UPDATE Locale set 
               nome = COALESCE(?,nome), 
               citta = COALESCE(?,citta) 
               WHERE idLocale = ?`,
            [data.nome, data.citta, req.params.id],
            function (err, result) {
                if (err){
                    res.status(400).json({"error": err.message})
                    return;
                }
                console.log(result )
                res.json({
                    message: "success",
                    data: data,
                    changes: result.affectedRows
                })
        });
    })



    app.delete("/api/Locale/:id", (req, res) => {
        connpool.execute(
            'DELETE FROM Locale WHERE idLocale = ?',
            [req.params.id],
            function (err, result) {
                if (err){
                    res.status(400).json({"error": err.message})
                    return;
                }
                res.json({"message":"deleted", changes: result.affectedRows})
        });
    })


}





module.exports = endpoint;