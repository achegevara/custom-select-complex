Здесь моя попытка реализовать усложнённую версию задания :)<br>
Не завершена, но некоторые фичи многоуровневости реализовал.

Основные(рабочие)) отличия от базовой версии:
1) Реализовал отрисовку многоуровневого селекта в окне выбора опций(selectWindow). Вложения по дефолту скрыты.
2) Добавил svg-стрелочки для UI открытия вложенностей. При смене состояния стрелки меняют своё направление.
Чтобы открыть вложенный уровень, можно нажать как на стрелку возле чекбокса, так и на текст опции.

Результат можно посмотреть в файле <b>index.html</b>, который находится в папке <b>/dist</b>.
Файлы-источники(предбилдовые), код с комментариями доступны в папке <b>/src</b>.

Если нужно будет пересобрать проект, как обычно, в директории проекта:<br>
npm install<br>
npm run build (npm start, если с включённым watch).<br>
