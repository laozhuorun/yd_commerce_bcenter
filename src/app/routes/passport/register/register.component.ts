import { Component, OnDestroy, Optional, Inject, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { SocialService, SocialOpenType, TokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { NzMessageService } from 'ng-zorro-antd';

import {
  AccountServiceProxy,
  TenantRegistrationServiceProxy,
  UserLoginInfoDto,
  TokenAuthServiceProxy,
  AuthenticateModel,
  IAuthenticateModel,
  SMSServiceProxy,
  CodeSendInput,
  RegisterTenantOutput,
} from '@shared/service-proxies/service-proxies';

import { ReuseTabService } from '@delon/abc';
import { FormComponentBase } from '@shared/app-component-base';
import { finalize, catchError } from 'rxjs/operators';
import { LoginService } from '@shared/service/login.service';

@Component({
  selector: 'passport-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less'],
})
export class UserRegisterComponent extends FormComponentBase implements OnDestroy {
  form: FormGroup;
  error = '';
  type = 0;
  visible = false;
  status = 'pool';
  progress = 0;
  passwordProgressMap = {
    ok: 'success',
    pass: 'normal',
    pool: 'exception',
  };

  tabs: any[] = [
    {
      key: 'mobile',
      tab: '手机注册',
      type: 1,
    },
    {
      key: 'email',
      tab: '邮箱注册',
      type: 2,
    },
  ];

  constructor(
    injector: Injector,
    fb: FormBuilder,
    private router: Router,
    public msg: NzMessageService,
    private accountSvc: TenantRegistrationServiceProxy,
    private smsSvc: SMSServiceProxy,
    @Optional()
    @Inject(ReuseTabService)
    private reuseTabSvc: ReuseTabService,
    @Inject(DA_SERVICE_TOKEN) private tokenSvc: TokenService,
    private loginService: LoginService,
  ) {
    super(injector);

    this.form = fb.group({
      tenancyName: [null, [Validators.required, Validators.maxLength(20)]],
      phoneNumber: [null, [Validators.required, Validators.pattern(/^1\d{10}$/)]],
      emailAddress: [null, [Validators.required, Validators.email]],
      type: [null, [Validators.required, Validators]],
      password: [null, [Validators.required, Validators.minLength(6), UserRegisterComponent.checkPassword.bind(this)]],
      confirm: [null, [Validators.required, Validators.minLength(6), UserRegisterComponent.passwordEquar]],
      registerCode: [null, [Validators.required]],
    });

    // 监听type值的变化，从而改变注册方式 value = 1 : 手机注册 value = 2 : 邮箱注册
    this.form.get('type').valueChanges.subscribe(value => {
      if (value === 1) {
        this.mobile.enable();
        this.mail.disable();
      } else {
        this.mobile.disable();
        this.mail.enable();
      }
    });

    this.form.get('type').setValue(1);
  }

  to(item) {
    this.form.get('type').setValue(item.type);
  }

  static checkPassword(control: FormControl) {
    if (!control) return null;
    const self: any = this;
    self.visible = !!control.value;
    if (control.value && control.value.length > 9) {
      self.status = 'ok';
    } else if (control.value && control.value.length > 5) {
      self.status = 'pass';
    } else {
      self.status = 'pool';
    }

    if (self.visible) {
      self.progress = control.value.length * 10 > 100 ? 100 : control.value.length * 10;
    }
  }

  static passwordEquar(control: FormControl) {
    if (!control || !control.parent) {
      return null;
    }
    if (control.value !== control.parent.get('password').value) {
      return { equar: true };
    }
    return null;
  }

  // #region fields

  get name() {
    return this.form.controls.tenancyName;
  }

  get mail() {
    return this.form.controls.emailAddress;
  }

  get password() {
    return this.form.controls.password;
  }

  get confirm() {
    return this.form.controls.confirm;
  }

  get mobile() {
    return this.form.controls.phoneNumber;
  }

  get captcha() {
    return this.form.controls.registerCode;
  }

  // #endregion

  // #region get captcha

  count = 0;
  interval$: any;

  getCaptcha() {
    if (this.mobile.invalid) {
      this.mobile.markAsDirty({ onlySelf: true });
      this.mobile.updateValueAndValidity({ onlySelf: true });
      return;
    }

    const data = new CodeSendInput({
      targetNumber: this.mobile.value,
      codeType: 10,
      captchaResponse: '',
    });

    this.smsSvc.sendCode(data).subscribe(res => {
      this.count = 59;
      this.interval$ = setInterval(() => {
        this.count -= 1;
        if (this.count <= 0) clearInterval(this.interval$);
      }, 1000);
    });
  }

  // #endregion

  submit() {
    this.error = '';
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.accountSvc
      .registerTenant(this.form.value)
      .pipe(
        finalize(() => {
          this.loading = false;
        }),
      )
      .pipe(catchError((err, caught): any => {}))
      .subscribe((res: RegisterTenantOutput) => {
        // if (res.error) {
        //   this.msg.error(res.error.msg);
        //   return false;
        // }

        this.reuseTabSvc.clear();

        if (!res.isActive) {
          this.router.navigate(['/passport/login']);
        }

        if (res.isActive) {
          this.loginService.authenticateModel.loginCertificate = this.name.value;
          this.loginService.authenticateModel.password = this.password.value;
          this.loginService.authenticate(() => {
            this.loading = false;
          });
        } else {
          this.router.navigate(['/passport/login']);
        }
      });
  }

  ngOnDestroy(): void {
    if (this.interval$) clearInterval(this.interval$);
  }
}
