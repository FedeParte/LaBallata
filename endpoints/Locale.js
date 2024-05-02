function endpoint(app, connpool) {

    app.post("/api/Locali", (req, res) => {
        var errors = []
        /* controllo dati inseriti
        if (!req.body.description) {
            errors.push("No description specified");
        }
        if (req.body.status === "") {
            errors.push("No status specified");
        }
        */
        if (errors.length) {
            res.status(400).json({ "error": errors.join(",") });
            return;
        }
        var data = {
            description: req.body.description,
            status: req.body.status,
        }

        var sql = 'INSERT INTO Locale (idLocale, nome, citta) VALUES (?,?)'
        var params = [data.description, data.status]
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
        var sql = "select * from Locale where Locale_id = ?"
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
            description: req.body.description,
            status: req.body.status,
        }
        connpool.execute(
            `UPDATE Locale set 
               description = COALESCE(?,description), 
               status = COALESCE(?,status) 
               WHERE Locale_id = ?`,
            [data.description, data.status, req.params.id],
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
            'DELETE FROM Locale WHERE Locale_id = ?',
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