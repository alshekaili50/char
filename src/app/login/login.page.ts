import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async presentLoading(message: string) {
    this.isLoading = true;
    const loading = await this.loadingCtrl.create({
      message,
      spinner: 'crescent'
    });
    await loading.present();
    return loading;
  }

  async showError(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      color: 'danger',
      position: 'bottom'
    });
    await toast.present();
  }

  async emailLogin() {
    if (this.loginForm.valid) {
      const loading = await this.presentLoading('Logging in...');
      try {
        const { email, password } = this.loginForm.value;
        await this.authService.emailSignIn(email, password);
        await this.router.navigate(['/tabs']);
      } catch (error: any) {
        await this.showError(error.message || 'Login failed');
      } finally {
        loading.dismiss();
        this.isLoading = false;
      }
    }
  }

  async socialLogin(provider: 'google' | 'facebook' | 'twitter' | 'github' | 'apple') {
    const loading = await this.presentLoading(`Logging in with ${provider}...`);
    try {
      switch (provider) {
        case 'google':
          await this.authService.googleSignIn();
          break;
        case 'facebook':
          await this.authService.facebookSignIn();
          break;
 
        case 'apple':
          await this.authService.appleSignIn();
          break;
      }
      await this.router.navigate(['/tabs']);
    } catch (error: any) {
      await this.showError(error.message || `${provider} login failed`);
    } finally {
      loading.dismiss();
      this.isLoading = false;
    }
  }
}
