# Ubah Gambar

Ubah Gambar is an open-source web application for converting images between various formats effortlessly. It supports multiple image formats and provides a user-friendly interface for batch processing and downloading converted files.

## Features

- Drag-and-drop image upload.
- Batch image conversion to formats like WebP, JPEG, PNG, and AVIF.
- Download individual converted images or all images as a ZIP file.
- Light and dark theme support.
- Responsive and accessible design.

## Demo

[Live Demo](#) (Add your live demo link here)

## Installation

To run this project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/ubah-gambar.git
   cd ubah-gambar
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run start
   ```

4. Open your browser and navigate to `http://localhost:3000`.

## Building for Production

To build the application for production:

```bash
npm run build
```

The production-ready files will be available in the `dist` directory.

## Libraries Used

This project leverages the following libraries and tools:

### Core Libraries
- **[React](https://reactjs.org/):** A JavaScript library for building user interfaces.
- **[TanStack Router](https://tanstack.com/router):** A powerful routing library for React.
- **[Tailwind CSS](https://tailwindcss.com/):** A utility-first CSS framework for styling.
- **[Lucide React](https://lucide.dev/):** A collection of beautifully crafted icons for React.
- **[Sonner](https://github.com/emilkowalski/sonner):** A toast notification library for React.
- **[JSZip](https://stuk.github.io/jszip/):** A library for creating and managing ZIP files.

### Image Processing
- **[@jsquash](https://github.com/jakearchibald/jsquash):** A collection of libraries for encoding and decoding image formats:
  - `@jsquash/avif`
  - `@jsquash/jpeg`
  - `@jsquash/jxl`
  - `@jsquash/png`
  - `@jsquash/webp`

### Utility Libraries
- **[clsx](https://github.com/lukeed/clsx):** A utility for constructing className strings conditionally.
- **[tailwind-merge](https://github.com/dcastil/tailwind-merge):** A utility to merge Tailwind CSS classes.
- **[class-variance-authority](https://github.com/joe-bell/cva):** A library for managing className variants.

### Development Tools
- **[Vite](https://vitejs.dev/):** A fast build tool for modern web development.
- **[Vitest](https://vitest.dev/):** A testing framework for Vite projects.
- **[@tanstack/react-query](https://tanstack.com/query):** A library for managing server state in React applications.
- **[@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react):** A Vite plugin for React.

## Usage

1. Drag and drop images into the upload area or click to browse files.
2. Select the desired output format for each image or apply a global format.
3. Click "Convert All" to process the images.
4. Download individual converted images or all images as a ZIP file.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature-name"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgments

Special thanks to the developers and maintainers of the libraries used in this project.

---
Feel free to open an issue or submit a pull request if you encounter any bugs or have suggestions for improvement.
