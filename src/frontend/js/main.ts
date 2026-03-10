import { MainController } from './controllers/MainController';
import { MainView } from './views/MainView';

const view = new MainView();
const controller = new MainController(view);

controller.initialize().catch(() => {
  // No-op base bootstrap
});
