function endpoint(app, connpool) {

    app.post("/api/Evento", (req, res) => {
        var errors = []
         
        var data = {
            nomeEvento: req.body.nomeEvento,
            costo: req.body.costo,
            idLocale: req.body.idLocale


        }

        var sql = 'INSERT INTO Evento (nomeEvento, costo, idLocale) VALUES (?,?,?)'
        var params = [data.nomeEvento, data.costo, data.idLocale ]
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



    app.get("/api/Evento", (req, res, next) => {
        var sql = "select * from Evento"
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


    app.get("/api/Evento/:id", (req, res) => {
        var sql = "select * from Evento where idEvento = ?"
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


    app.put("/api/Evento/:id", (req, res) => {
        var data = {
            nomeEvento: req.body.nomeEvento,
            costo: req.body.costo,
            idLocale: req.body.idLocale,
        }
        connpool.execute(
            `UPDATE Evento set 
               nomeEvento = COALESCE(?,nomeEvento), 
               costo = COALESCE(?,costo),
               idLocale = COALESCE(?,idLocale) 
               WHERE idEvento = ?`,
            [data.nomeEvento, data.costo, data.idLocale, req.params.id],
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



    app.delete("/api/Evento/:id", (req, res) => {
        connpool.execute(
            'DELETE FROM Evento WHERE idEvento = ?',
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