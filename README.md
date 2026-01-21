# Dokumentacja API aplikacji Whiteboard

## Uruchamianie projektu

- frontend: `npx expo start`
- backend: `python manage.py runserver`

## Autentykacja

Aplikacja korzysta z protokołu JWT (JSON Web Token). Wszystkie żądania (poza rejestracją i logowaniem) muszą zawierać nagłówek:
Authorization: Bearer <access_token>

### Endpointy autentykacji

| Metoda | Endpoint            | Opis                           | Body (JSON)               |
| :----- | :------------------ | :----------------------------- | :------------------------ |
| POST   | /api/register/      | Rejestracja nowego użytkownika | username, password, email |
| POST   | /api/login/         | Logowanie i pobranie tokenów   | username, password        |
| POST   | /api/logout/        | Wylogowanie                    | {}                        |
| POST   | /api/token/refresh/ | Odświeżenie tokena Access      | refresh                   |

## Zarządzanie tablicami (Grids)

| Metoda | Endpoint                | Opis                     | Uwagi                    |
| :----- | :---------------------- | :----------------------- | :----------------------- |
| GET    | /api/grids/             | Lista tablic użytkownika | Bez elementów            |
| POST   | /api/grids/create/      | Tworzenie nowej tablicy  | Wymaga pola name         |
| GET    | /api/grids/`<pk>`/        | Szczegóły tablicy        | Zawiera listę elementów  |
| PATCH  | /api/grids/`<pk>`/update/ | Edycja danych tablicy    | Np. zmiana nazwy         |
| DELETE | /api/grids/`<pk>`/delete/ | Usuwanie tablicy         | Usuwa kaskadowo elementy |

## Zarządzanie elementami (Board Elements)

| Metoda | Endpoint                           | Opis                  | Body (JSON)                    |
| :----- | :--------------------------------- | :-------------------- | :----------------------------- |
| POST   | /api/grids/`<grid_id>`/elements/add/ | Dodanie elementu      | element_type, x, y, properties |
| PATCH  | /api/elements/`<pk>`/update/         | Aktualizacja elementu | x, y, properties               |
| DELETE | /api/elements/`<pk>`/delete/         | Usunięcie elementu    | Usuwa obiekt z tablicy         |
