import { Component, Input, OnInit } from '@angular/core';
import { NeoComVariant } from '../../innovative-core/domain/NeoComVariant';
import { ServerStatusV1Node } from '../../innovative-core/domain/nodes/server-status-v1.node';
import type { IViewer } from '../../innovative-core/domain/interfaces/IViewer.interface';
import { registerRender } from '../render-registry';

@Component({
  selector: 'v1-server-status-render',
  templateUrl: './v1-server-status-render.component.html',
  styleUrl: './v1-server-status-render.component.scss',
})
export class V1ServerStatusRenderComponent implements OnInit {
  @Input() container: IViewer | null = null;
  @Input() node!: ServerStatusV1Node;
  @Input() variant: NeoComVariant | string = NeoComVariant.DEFAULT;

  private static registered = false;

  static ensureRegistered(): void {
    if (V1ServerStatusRenderComponent.registered) {
      return;
    }
    registerRender('ServerStatusV1', V1ServerStatusRenderComponent);
    V1ServerStatusRenderComponent.registered = true;
  }

  ngOnInit(): void {
    V1ServerStatusRenderComponent.ensureRegistered();
  }

  getNode(): ServerStatusV1Node {
    return this.node;
  }

  getServerName(): string {
    const name = this.getNode()?.getServerName() ?? '';
    if (!name) {
      return '—';
    }
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }

  getOnlineLabel(): string {
    return this.getNode() ? 'ONLINE' : 'OFFLINE';
  }

  getPlayersCount(): number {
    return this.getNode()?.getPlayersCount() ?? 0;
  }

  getBackendVersion(): string {
    return this.getNode()?.getBackendVersion() ?? '—';
  }

  getSDEVersion(): string {
    return this.getNode()?.getSDEVersion() ?? '—';
  }

  getNextDowntime(): string {
    return this.getNode()?.getNextDowntime() ?? '—';
  }
}

V1ServerStatusRenderComponent.ensureRegistered();
