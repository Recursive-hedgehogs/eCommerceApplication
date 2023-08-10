export const getTemplate = () => {
    return `
    <div class="wrapper-modal">
    <div class="container">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Log in</h5>
          <button id="btn-close-modal" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
          <span aria-hidden="true"></span>
          </button>
          </button>
        </div>
          <form class="modal-form" name="modal-form">
           <div class="modal-body">
              <div class="email form-item">
                <input id="input-modal-email" type="email" class="form-control" placeholder="Enter your e-mail" required>
                <div class="invalid-feedback">Error! E-mail is incorrect</div>
              </div>
              <div class="password form-item">
                <div class="input-group">
                  <input id="input-modal-password" type="password" class="form-control" placeholder="Enter your password" required>
                  <div class="input-group-append">
                    <button id="toggle-password" class="btn btn-outline-secondary" type="button">
                      <i id="password-icon" class="fas fa-eye-slash"></i>
                    </button>
                  </div>
                 </div>
                <div class="invalid-feedback">Error! Password is incorrect</div>
              </div>
            </div>
            <button id="btn-sign-in" type="submit" class="btn btn-primary">Sign in</button>
          </form>
      </div>
    </div>
  </div>
  </div>`;
};
