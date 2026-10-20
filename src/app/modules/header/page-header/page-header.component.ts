import { Component, Input, OnChanges, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApplicationInfoV1, ServerStatusV1 } from 'neocom-domain';
import { NeoComVariant } from '../../innovative-core/domain/NeoComVariant';
import { StandaloneNodePanelComponent } from '../../shared/standalone-node-panel/standalone-node-panel.component';
import '../../renders/v1-application-info-render/v1-application-info-render.component';
import '../../renders/v1-server-status-render/v1-server-status-render.component';
import { ApplicationInfoProvider } from '../providers/application-info.provider';
import { ServerStatusProvider } from '../providers/server-status.provider';

/** Header chrome variants (subset of {@link NeoComVariant}). */
export type PageHeaderVariant = NeoComVariant.APP | NeoComVariant.AUTH;

/**
 * Header controller: obtains ApplicationInfoV1 / ServerStatusV1 via providers
 * and injects them into versioned renders (UI-HDR-007…009, UI-VER-*).
 */
@Component({
  selector: 'app-page-header',
  imports: [StandaloneNodePanelComponent],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss',
})
export class PageHeaderComponent implements OnInit, OnChanges, OnDestroy {
  /** Exposed for templates — use {@link NeoComVariant} constants only. */
  protected readonly Variant = NeoComVariant;

  /** `-AUTH-` — ApplicationInfoV1 only. `-APP-` — ApplicationInfoV1 + ServerStatusV1 (+ menu later). */
  @Input() variant: PageHeaderVariant = NeoComVariant.APP;

  private readonly applicationInfoProvider = inject(ApplicationInfoProvider);
  private readonly serverStatusProvider = inject(ServerStatusProvider);

  protected applicationInfo: ApplicationInfoV1 | null = null;
  protected serverStatus: ServerStatusV1 | null = null;

  private serverSub?: Subscription;

  ngOnInit(): void {
    this.refreshNodes();
  }

  ngOnChanges(): void {
    this.refreshNodes();
  }

  ngOnDestroy(): void {
    this.serverSub?.unsubscribe();
  }

  private refreshNodes(): void {
    this.applicationInfo = this.applicationInfoProvider.getApplicationInfo();
    this.serverSub?.unsubscribe();
    this.serverStatus = null;
    if (this.variant !== NeoComVariant.APP) {
      return;
    }
    this.serverSub = this.serverStatusProvider.getServerStatus().subscribe((status) => {
      this.serverStatus = status;
    });
  }
}
