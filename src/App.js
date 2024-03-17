import "./App.css";
import { drinks } from "./data/drinks";
import { Button, Checkbox, FormControlLabel } from "@mui/material";
import { useCallback, useState } from "react";

function App() {
  const todosIngredientes = drinks
    .reduce((acc, curr) => {
      const list = curr.ingredientes.filter(
        (i) =>
          !acc.find(
            (findIngredient) =>
              findIngredient.toLocaleLowerCase() === i.toLocaleLowerCase()
          )
      );
      return [...acc, ...list];
    }, [])
    .sort(function (a, b) {
      if (a < b) {
        return -1;
      }
      if (a > b) {
        return 1;
      }
      return 0;
    });

  const [respostas, setRespostas] = useState([]);

  const onChangeIngrediente = (nomeDrink, ingrediente) => {
    const hasDrink = respostas?.find(
      (findDrink) => findDrink?.name === nomeDrink
    );
    if (hasDrink) {
      const hasIngrediente = hasDrink.ingredientes.find(
        (ingred) => ingred.name === ingrediente
      );
      if (hasIngrediente) {
        const newArray = respostas.map((resposta) => {
          if (resposta?.name === nomeDrink) {
            return {
              name: nomeDrink,
              ingredientes: resposta.ingredientes.filter(
                (ingred) => ingred.name !== ingrediente
              ),
            };
          }
        });
        setRespostas(newArray);
      } else {
        const newArray = respostas.map((resposta) => {
          if (resposta?.name === nomeDrink) {
            return {
              name: nomeDrink,
              ingredientes: [
                ...resposta.ingredientes,
                {
                  name: ingrediente,
                  error: false,
                  isRight: undefined,
                  selected: true,
                },
              ],
            };
          }
        });
        setRespostas(newArray);
      }
    } else {
      setRespostas([
        ...respostas,
        {
          name: nomeDrink,
          ingredientes: [
            {
              name: ingrediente,
              error: false,
              isRight: undefined,
              selected: true,
            },
          ],
        },
      ]);
    }
  };

  const getColor = useCallback(
    (drinkName, ingrediente) => {
      const ing = respostas
        .find((resposta) => resposta?.name === drinkName)
        ?.ingredientes.find((ingred) => ingred.name === ingrediente);

      if (ing?.error) return "#ad1457";

      if (ing?.isRight) return "#2e7d32";

      return undefined;
    },
    [respostas]
  );

  const verifyDrink = (nomeDrink) => {
    const userRespostas = respostas?.find((drink) => drink?.name === nomeDrink);
    const answers = drinks.find((drink) => drink?.name === nomeDrink);
    const answerIngredients = answers.ingredientes.map((ingrediente) => {
      return { name: ingrediente };
    });

    const feedBack = answerIngredients.map((ingred) => {
      const hasIngred = userRespostas?.ingredientes?.find(
        (ingredien) => ingredien.name === ingred.name
      );
      if (hasIngred) {
        return { ...hasIngred, isRight: true, selected: true };
      } else {
        return { ...ingred, isRight: true, selected: false };
      }
    });

    let feedBackWrong = userRespostas?.ingredientes?.filter((ingred) => {
      const find = feedBack.find((i) => i.name === ingred.name);

      return !find;
    });

    feedBackWrong = feedBackWrong.map((ingred) => {
      return { ...ingred, error: true, selected: true };
    });

    const newArray = respostas.filter(
      (resposta) => resposta?.name !== nomeDrink
    );

    setRespostas([
      ...newArray,
      { name: nomeDrink, ingredientes: [...feedBack, ...feedBackWrong] },
    ]);
  };

  return (
    <div>
      {drinks.map((drink) => {
        return (
          <div key={drink.name}>
            <h2>Quais são os ingredientes do drink {drink.name}?</h2>

            <div>
              {todosIngredientes.map((ingrediente) => (
                <FormControlLabel
                  style={{ width: "40%" }}
                  key={ingrediente}
                  control={
                    <Checkbox
                      onClick={() =>
                        onChangeIngrediente(drink.name, ingrediente)
                      }
                      checked={
                        !!respostas
                          .find((resposta) => resposta?.name === drink.name)
                          ?.ingredientes.find(
                            (ingred) => ingred.name === ingrediente
                          )?.selected
                      }
                      sx={{
                        color: getColor(drink.name, ingrediente),
                        "&.Mui-checked": {
                          color: getColor(drink.name, ingrediente),
                        },
                      }}
                    />
                  }
                  label={ingrediente}
                />
              ))}
            </div>
            <Button variant="contained" onClick={() => verifyDrink(drink.name)}>
              Enviar
            </Button>
          </div>
        );
      })}
    </div>
  );
}

export default App;
