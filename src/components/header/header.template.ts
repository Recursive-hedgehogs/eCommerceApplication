export const getTemplate = () => {
    return `<nav class="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
            <div class="container-fluid">
              <a class="navbar-brand" href="#">MainLogo</a>
              <form class="d-flex my-d-flex">
              <button class="btn btn-secondary" type="button">
                <i class="fas fa-user-lock"></i><span class="my-btn-link">    Log in</span></button>
              <button class="btn btn-secondary" type="button">
               <i class="fas fa-user-plus">     Register</i></button>
              </form>
            </div>
          </nav>`;
};