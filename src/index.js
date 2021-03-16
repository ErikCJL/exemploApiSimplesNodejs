const express = require("express");
const { uuid, isUuid } = require("uuidv4"); // Cria um ID único, pode servir como chave

const app = express();

app.use(express.json());

/*
*Métodos HTTP:
*
*GET: Buscar informações do back-end
*POST : criar informação no back-end
*PUT/PATCH: Alterar uma informação no back-end
*DELETE: Deletar uma informação no back-end

*Tipos de Parâmetros
*query
*Params
*Request Body

*Middleware: Interceptador de requisições que pode interromper totalmente a requisição ou alterar dados da requisição.
*/

const projects = [];

function logRequests(request, response, next) {
  /*
  const { title, owner } = request.body;
  const { method, url } = request;

  const logLabel = `[${method.toUpperCase()} ${url}]`;

  console.log(logLabel)
  return next();
  */

  console.log("Fez algo no get");
  return next();
}

function validateProjectId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "INVALID PROJECT ID" });
  }

  return next();
}

function MiddlewareInGetExample(request, response, next) {
  const { title, owner } = request.body;
  const { method, url } = request;

  const logLabel = `[${method.toUpperCase()} ${url}]`;

  console.log(logLabel);
  return next();
}

app.use(logRequests);

app.get("/projects", MiddlewareInGetExample, (request, response) => {
  const query = request.query;
  const params = request.params;
  console.log("query:", query);
  return response.json(projects);
});

app.post("/projects", (request, response) => {
  const { title, owner } = request.body;
  const project = { id: uuid(), title, owner };
  projects.push(project);
  return response.json(project);
});

app.put("/projects/:id", validateProjectId, (request, response) => {
  const { title, owner } = request.body;
  console.log("request.params", request.params.id);
  console.log("projects", projects);
  if (projects) {
    const projectIndex = projects.findIndex(
      (project) => project.id === request.params.id
    );

    if (projectIndex < 0) {
      return response.status(400).json({ error: "Project not found." });
    }

    const project = {
      id,
      title,
      owner,
    };

    projects[projectIndex] = project;

    return response.json(project);
  } else {
    return response.json({ "Error:": "A Tabela não possúi projetos." });
  }
});

app.listen(3333, () => {
  console.log("back-end started!");
});
