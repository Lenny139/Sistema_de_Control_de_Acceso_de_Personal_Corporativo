type Dictionary = Record<string, string>;

export class MainView {
  readonly renderTexts = (messages: Dictionary): void => {
    this.setText('title', messages.title);
    this.setText('loginTitle', messages.loginTitle);
    this.setText('employeesTitle', messages.employeesTitle);
    this.setText('loginBtn', messages.loginBtn);
  };

  readonly renderEmployees = (employees: Array<{ id: string; nombre: string; role: string }>): void => {
    const list = document.getElementById('employeeList');

    if (!list) {
      return;
    }

    list.innerHTML = employees
      .map((employee) => `<li class="list-group-item">${employee.id} - ${employee.nombre} (${employee.role})</li>`)
      .join('');
  };

  readonly bindLogin = (handler: (username: string, password: string) => void): void => {
    const form = document.getElementById('loginForm') as HTMLFormElement | null;

    form?.addEventListener('submit', (event) => {
      event.preventDefault();

      const username = (document.getElementById('username') as HTMLInputElement).value;
      const password = (document.getElementById('password') as HTMLInputElement).value;
      handler(username, password);
    });
  };

  readonly bindLanguageToggle = (handler: () => void): void => {
    document.getElementById('langToggle')?.addEventListener('click', handler);
  };

  private readonly setText = (id: string, value?: string): void => {
    const element = document.getElementById(id);

    if (!element || value === undefined) {
      return;
    }

    element.textContent = value;
  };
}
