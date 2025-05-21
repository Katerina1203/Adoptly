Процедура за инсталиране, компилиране и стартиране на приложението Adoptly
1. Структура на проекта:
(/src)
/src

 ┣ app         – Next.js страници и маршрутизация
 
 ┣ components  – Повторно използваеми UI компоненти
 
 ┣ lib         – Логика, Mongoose модели и действия
 
 ┣ types       – TypeScript интерфейси и типове
 
 ┣ public      – Статични ресурси (изображения, икони и др.)

2. Изисквания (Prerequisites)
   
Уверете се, че имате инсталирани:
Инструмент	Препоръчителна версия
Node.js   	v18.x LTS или по-нова
npm / yarn	Съвместим с избрания Node.js
MongoDB	    Локално или чрез MongoDB Atlas
Git	        За клониране на проекта

3.Клониране на проекта
Изпълнете следните команди в терминал:
git clone https://github.com/Katerina1203/Adoptly.git

cd Adoptly

4. Инсталиране на зависимостите
С npm:
npm install

Или с yarn:
yarn install


5. Конфигуриране на средата (.env файл)
Създайте файл .env в root директорията със следното съдържание:

MONGODB_URI=mongodb+srv://<your_user>:<your_pass>@<your_cluster>/<db_name>
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

6. Стартиране на приложението в режим за разработка
С npm:
npm run dev

Или с yarn:
yarn dev

След стартиране, приложението ще бъде достъпно на:
 http://localhost:3000
 
7. Допълнителни команди
Команда	Описание
npm run build  	Генерира production билд
npm start     	Стартира вече компилираната production версия
npm run lint	  Извършва проверка за синтактични/логически грешки

=======
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
