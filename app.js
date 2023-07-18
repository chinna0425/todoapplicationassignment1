const dates = require("date-fns");
const isMatch = require("date-fns/isMatch");
const isValid = require("date-fns/isValid");
const express = require("express");
const app = express();

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const dbPath = path.join(__dirname, "todoApplication.db");
let db = null;
app.use(express.json());

const initializationDbServer = async (req, res) => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, (req, res) => {
      console.log("Db is running at server 3000 port");
    });
  } catch (e) {
    console.log(`Db error is ${e.message}`);
    process.exit(1);
  }
};
initializationDbServer();

app.get("/todos/", async (req, res) => {
  const {
    search_q = undefined,
    status = undefined,
    priority = undefined,
    category = undefined,
    date = undefined,
  } = req.query;

  const priorityandstatusCheck = (request) => {
    const isbool =
      request.priority !== undefined && request.status !== undefined;

    return isbool;
  };

  const categoryandstatus = (request) => {
    return request.category !== undefined && request.status !== undefined;
  };

  const categoryandpriority = (request) => {
    return request.category !== undefined && request.priority !== undefined;
  };
  switch (true) {
    case priorityandstatusCheck(req.query):
      if (
        req.query.priority === "HIGH" ||
        req.query.priority === "LOW" ||
        req.query.priority === "MEDIUM"
      ) {
        if (
          req.query.status === "TO DO" ||
          req.query.status === "IN PROGRESS" ||
          req.query.status === "DONE"
        ) {
          const dataquery = `select * from todo where status like "%${status}" and priority like "%${priority}%" `;
          const result = await db.all(dataquery);
          const convert = result.map((each) => ({
            id: each.id,
            todo: each.todo,
            priority: each.priority,
            status: each.status,
            category: each.category,
            dueDate: each.due_date,
          }));
          res.send(convert);
        } else {
          res.status(400);
          res.send("Invalid Todo Status");
        }
      } else {
        res.status(400);
        res.send("Invalid Todo Priority");
      }
      break;

    case categoryandstatus(req.query):
      if (
        req.query.category === "WORK" ||
        req.query.category === "HOME" ||
        req.query.category === "LEARNING"
      ) {
        if (
          req.query.status === "TO DO" ||
          req.query.status === "IN PROGRESS" ||
          req.query.status === "DONE"
        ) {
          const dataquery = `select * from todo where status like "%${status}" and category like "%${category}%" `;
          const result = await db.all(dataquery);
          const convert = result.map((each) => ({
            id: each.id,
            todo: each.todo,
            priority: each.priority,
            status: each.status,
            category: each.category,
            dueDate: each.due_date,
          }));
          res.send(convert);
        } else {
          res.status(400);
          res.send("Invalid Todo Status");
        }
      } else {
        res.status(400);
        res.send("Invalid Todo Category");
      }
      break;
    case categoryandpriority(req.query):
      if (
        req.query.category === "WORK" ||
        req.query.category === "HOME" ||
        req.query.category === "LEARNING"
      ) {
        if (
          req.query.priority === "HIGH" ||
          req.query.priority === "LOW" ||
          req.query.priority === "MEDIUM"
        ) {
          const dataquery = `select * from todo where category like "%${category}" and priority like "%${priority}%" `;
          const result = await db.all(dataquery);
          const convert = result.map((each) => ({
            id: each.id,
            todo: each.todo,
            priority: each.priority,
            status: each.status,
            category: each.category,
            dueDate: each.due_date,
          }));
          res.send(convert);
        } else {
          res.status(400);
          res.send("Invalid Todo Priority");
        }
      } else {
        res.status(400);
        res.send("Invalid Todo Category");
      }
      break;
    case req.body.status !== undefined:
      if (
        req.query.status === "TO DO" ||
        req.query.status === "IN PROGRESS" ||
        req.query.status === "DONE"
      ) {
        const dataquery = `select * from todo where status like "%${status}"`;
        const result = await db.all(dataquery);
        const convert = result.map((each) => ({
          id: each.id,
          todo: each.todo,
          priority: each.priority,
          status: each.status,
          category: each.category,
          dueDate: each.due_date,
        }));
        res.send(convert);
      } else {
        res.status(400);
        res.send("Invalid Todo Status");
      }
      break;
    case req.query.category !== undefined:
      if (
        req.query.category === "WORK" ||
        req.query.category === "HOME" ||
        req.query.category === "LEARNING"
      ) {
        const dataquery = `select * from todo where category like "%${category}"`;
        const result = await db.all(dataquery);
        const convert = result.map((each) => ({
          id: each.id,
          todo: each.todo,
          priority: each.priority,
          status: each.status,
          category: each.category,
          dueDate: each.due_date,
        }));
        res.send(convert);
      } else {
        res.status(400);
        res.send("Invalid Todo Category");
      }
      break;
    case req.query.priority !== undefined:
      if (
        req.query.priority === "HIGH" ||
        req.query.priority === "LOW" ||
        req.query.priority === "MEDIUM"
      ) {
        const dataquery = `select * from todo where priority like "%${priority}%"`;
        const result = await db.all(dataquery);
        const convert = result.map((each) => ({
          id: each.id,
          todo: each.todo,
          priority: each.priority,
          status: each.status,
          category: each.category,
          dueDate: each.due_date,
        }));
        res.send(convert);
      } else {
        res.status(400);
        res.send("Invalid Todo Priority");
      }
      break;
    case req.query.date !== undefined:
      if (isMatch(req.query.date, "yyyy-MM-dd")) {
        const dataquery = `select * from todo where due_date like "${date}"`;
        const result = await db.all(dataquery);
        const convert = result.map((each) => ({
          id: each.id,
          todo: each.todo,
          priority: each.priority,
          status: each.status,
          category: each.category,
          dueDate: each.due_date,
        }));
        res.send(convert);
      } else {
        res.status(400);
        res.send("Invalid Due Date");
      }
      break;

    case req.query.search_q !== undefined:
      const dataquerys = `select * from todo where todo like "%${search_q}%"`;
      const results = await db.all(dataquerys);
      const converts = results.map((each) => ({
        id: each.id,
        todo: each.todo,
        priority: each.priority,
        status: each.status,
        category: each.category,
        dueDate: each.due_date,
      }));
      res.send(converts);
      break;
    default:
      const dataquery = `select * from todo`;
      const result = await db.all(dataquery);
      const convert = result.map((each) => ({
        id: each.id,
        todo: each.todo,
        priority: each.priority,
        status: each.status,
        category: each.category,
        dueDate: each.due_date,
      }));
      res.send(convert);
  }
});
//GET

app.get("/todos/:todoId/", async (req, res) => {
  const { todoId } = req.params;
  const query = `select * from todo where id=${todoId}`;
  const qres = await db.get(query);
  const covert = {
    id: qres.id,
    todo: qres.todo,
    priority: qres.priority,
    status: qres.status,
    category: qres.category,
    dueDate: qres.due_date,
  };
  res.send(covert);
});
//GET

app.get("/agenda/", async (req, res) => {
  const { date } = req.query;
  const rs = dates.format(new Date(date), "yyyy-MM-dd");
  const query = `select * from todo where due_date="${rs}"`;
  const rquery = await db.all(query);
  if (rquery.length === 0) {
    res.status(400);
    res.send("Invalid Due Date");
  } else {
    const convert = rquery.map((each) => ({
      id: each.id,
      todo: each.todo,
      priority: each.priority,
      status: each.status,
      category: each.category,
      dueDate: each.due_date,
    }));
    res.send(convert);
  }
});

//GET

/* 
const insertq = `insert into todo(id,todo,status,priority,category,due_date) values(${id},"${todo}","${status}","${category}","${priority}","${dueDate}")`;
    await db.run(insertq);
    res.send("Todo Successfully Added"); */

app.post("/todos/", async (req, res) => {
  let msg;
  const { id, todo, status, priority, category, dueDate } = req.body;
  const selectq = `select * from todo where id=${id}`;
  const selectres = await db.get(selectq);

  if (status === "TO DO" || status === "IN PROGRESS" || status === "DONE") {
    if (priority === "HIGH" || priority === "LOW" || priority === "MEDIUM") {
      if (
        category === "HOME" ||
        category === "LEARNING" ||
        category === "WORK"
      ) {
        if (isMatch(dueDate, "yyyy-MM-dd")) {
          const insertq = `insert into todo(id,todo,status,priority,category,due_date) values(${id},"${todo}","${status}","${category}","${priority}","${dueDate}")`;
          await db.run(insertq);
          res.send("Todo Successfully Added");
        } else {
          res.status(400);
          res.send("Invalid Due Date");
        }
      } else {
        res.status(400);
        res.send("Invalid Todo Category");
      }
    } else {
      res.status(400);
      res.send("Invalid Todo Priority");
    }
  } else {
    res.status(400);
    res.send("Invalid Todo Status");
  }
});

app.put("/todos/:todoId/", async (req, res) => {
  let msg;
  let msg1;
  const { todoId } = req.params;
  function msgtext() {
    const {
      status = "",
      todo = "",
      priority = "",
      category = "",
      dueDate = "",
    } = req.body;

    if (status !== "") {
      if (status === "TO DO" || status === "IN PROGRESS" || status === "DONE") {
        msg = "Status";
      } else {
        msg1 = "Invalid Todo Status";
      }
    } else if (priority !== "") {
      if (priority === "HIGH" || priority === "MEDIUM" || priority === "LOW") {
        msg = "Priority";
      } else {
        msg1 = "Invalid Todo Priority";
      }
    } else if (todo !== "") {
      msg = "Todo";
    } else if (category !== "") {
      if (
        category === "WORK" ||
        category === "HOME" ||
        category === "LEARNING"
      ) {
        msg = "Category";
      } else {
        msg1 = "Invalid Todo Category";
      }
    } else {
      if (dueDate !== "") {
        msg = "Due Date";
      } else {
        msg1 = "Invalid Due Date";
      }
    }
  }
  msgtext();
  if (
    msg === "Status" ||
    msg === "Priority" ||
    msg === "Todo" ||
    msg === "Category" ||
    msg === "Due Date"
  ) {
    const selectqu = `select * from todo where id=${todoId}`;
    const runselect = await db.get(selectqu);
    const {
      status = runselect.status,
      todo = runselect.todo,
      priority = runselect.priority,
      category = runselect.category,
      dueDate = runselect.due_date,
    } = req.body;
    const update = `update todo set status="${status}",todo="${todo}",priority="${priority}",category="${category}",due_date="${dueDate}"`;
    await db.run(update);
    res.send(msg + " Updated");
  } else {
    res.status(400);
    res.send(msg1);
  }
});

app.delete("/todos/:todoId/", async (req, res) => {
  const { todoId } = req.params;
  const query = `delete from todo where id=${todoId}`;
  await db.run(query);
  res.send("Todo Deleted");
});
module.exports = app;
/* const dataquery = `select * from todo where status like "%${status}" and category like "%${category}%" and priority like "%${priority}%" and todo like "%${search_q}%"`;
  const result = await db.all(dataquery);
  const convert = result.map((each) => ({
    id: each.id,
    todo: each.todo,
    priority: each.priority,
    status: each.status,
    category: each.category,
    dueDate: each.due_date,
  }));
  res.send(convert); */
