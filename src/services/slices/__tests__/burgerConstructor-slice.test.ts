import burgerConstructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  burgerConstructorInitialState
} from '../burgerConstructor-slice';
import { TConstructorIngredient } from '@utils-types';

describe('Тестирование редьюсера burgerConstructor', () => {
  const generateIngredient = (id: string): TConstructorIngredient => ({
    id,
    _id: id,
    name: `ingredient-${id}`,
    type: 'main',
    price: 100,
    proteins: 0,
    fat: 0,
    carbohydrates: 0,
    calories: 0,
    image: '',
    image_large: '',
    image_mobile: ''
  });

  it('проверка добавления нового ингредиента', () => {
    const initialState = burgerConstructorInitialState;
    const action = addIngredient(generateIngredient('1'));
    const updatedState = burgerConstructorReducer(initialState, action);

    expect(updatedState.constructorItems.ingredients.length).toBe(1);
    expect(updatedState.constructorItems.ingredients[0].id).toBeDefined();
    expect(updatedState.constructorItems.ingredients[0].id).not.toBe('');
    expect(updatedState.constructorItems.ingredients[0]._id).toBe('1');
    expect(updatedState.constructorItems.ingredients[0].id).not.toBe('1');
  });

  it('проверка удаления ингредиента', () => {
    const initialState = burgerConstructorInitialState;
    const action = removeIngredient({ id: '1' });
    const updatedState = burgerConstructorReducer(initialState, action);

    expect(updatedState.constructorItems.ingredients.length).toBe(0);
  });

  it('проверка перемещения ингредиента вверх', () => {
    const initialState = {
      ...burgerConstructorInitialState,
      constructorItems: {
        bun: null,
        ingredients: [generateIngredient('1'), generateIngredient('2')]
      }
    };
    const action = moveIngredientUp(1);
    const updatedState = burgerConstructorReducer(initialState, action);

    expect(updatedState.constructorItems.ingredients[0].id).toBe('2');
    expect(updatedState.constructorItems.ingredients[1].id).toBe('1');
  });

  it('проверка перемещения ингредиента вниз', () => {
    const initialState = {
      ...burgerConstructorInitialState,
      constructorItems: {
        bun: null,
        ingredients: [generateIngredient('1'), generateIngredient('2')]
      }
    };
    const action = moveIngredientDown(0);
    const updatedState = burgerConstructorReducer(initialState, action);

    expect(updatedState.constructorItems.ingredients[0].id).toBe('2');
    expect(updatedState.constructorItems.ingredients[1].id).toBe('1');
  });
});