import { Component, Input, OnChanges, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { NeoComVariant } from '../../innovative-core/domain/NeoComVariant';
import { ApplicationInfoV1Node } from '../../innovative-core/domain/nodes/application-info-v1.node';
import { ServerStatusV1Node } from '../../innovative-core/domain/nodes/server-status-v1.node';
import { StandaloneNodePanelComponent } from '../../shared/standalone-node-panel/standalone-node-panel.component';
import '@renders/v1-application-info-render/v1-application-info-render.component';
import '@renders/v1-server-status-render/v1-server-status-render.component';
import { ApplicationInfoProvider } from '../providers/application-info.provider';
import { ServerStatusProvider } from '../providers/server-status.provider';

/** Header chrome variants (subset of {@link NeoComVariant}). */
export type AppPageHeaderVariant = NeoComVariant.APP | NeoComVariant.AUTH;

/**
 * Header controller: obtains NeoCom nodes (wrapping domain Records) via providers
 * and injects them into versioned renders (UI-HDR-007…011, UI-VER-*).
 */
@Component({
  selector: 'app-page-header',
  imports: [StandaloneNodePanelComponent],
  templateUrl: './app-page-header.component.html',
  styleUrl: './app-page-header.component.scss',
})
export class AppPageHeaderComponent implements OnInit, OnChanges, OnDestroy {
  /** Exposed for templates — use {@link NeoComVariant} constants only. */
  protected readonly Variant = NeoComVariant;

  /** `-AUTH-` — ApplicationInfo only. `-APP-` — ApplicationInfo + ServerStatus (+ menu later). */
  @Input() variant: AppPageHeaderVariant = NeoComVariant.APP;

  private readonly applicationInfoProvider = inject(ApplicationInfoProvider);
  private readonly serverStatusProvider = inject(ServerStatusProvider);

  protected applicationInfo: ApplicationInfoV1Node | null = null;
  protected serverStatus: ServerStatusV1Node | null = null;

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
